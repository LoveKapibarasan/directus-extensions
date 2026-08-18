'use client';

import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { useForm } from '@refinedev/react-hook-form';
import { useSelect } from '@refinedev/core';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button } from '@lib/components/ui/button';
import { Input } from '@lib/components/ui/input';
import { Checkbox } from '@lib/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@lib/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lib/components/ui/select';
import { Label } from '@lib/components/ui/label';

export interface ResourceFormField {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'datetime-local' | 'checkbox' | 'relation';
  // For type: 'relation' — renders a searchable select backed by another resource.
  relation?: {
    resource: string;
    optionLabel: string;
    optionValue?: string;
  };
}

interface ResourceFormProps {
  resource: string;
  id?: number;
  schema: z.ZodTypeAny;
  fields: ResourceFormField[];
  basePath: string;
  title: string;
}

function RelationField({
  field,
  control,
}: {
  field: ResourceFormField;
  control: any;
}) {
  const optionLabelKey = field.relation!.optionLabel;
  const optionValueKey = field.relation!.optionValue ?? 'id';
  const { options, query } = useSelect({
    resource: field.relation!.resource,
    optionLabel: optionLabelKey as any,
    optionValue: optionValueKey as any,
    meta: { fields: Array.from(new Set([optionValueKey, optionLabelKey])) },
  });

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: controllerField }) => (
        <Select
          value={controllerField.value != null ? String(controllerField.value) : undefined}
          onValueChange={(v) => controllerField.onChange(v ? Number(v) : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder={query.isLoading ? 'Loading...' : 'Select...'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={String(o.value)} value={String(o.value)}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

// react-hook-form's plain register() is uncontrolled (no `value` prop) — but
// our shared shadcn Input (copied from citrineos-operator-ui) always forces a
// controlled `value` prop (`value={value == null ? '' : value}`), which
// resets to '' on every render when no value prop is supplied. So every field
// here goes through Controller, matching how the source component is
// actually used upstream.
function TextField({ field, control }: { field: ResourceFormField; control: any }) {
  const inputType =
    field.type === 'number' ? 'number' : field.type === 'datetime-local' ? 'datetime-local' : 'text';

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: cf }) => (
        <Input
          id={field.name}
          type={inputType}
          step={field.type === 'number' ? 'any' : undefined}
          value={cf.value ?? ''}
          ref={cf.ref}
          onBlur={cf.onBlur}
          onChange={(e) => {
            if (field.type === 'number') {
              const raw = e.target.value;
              cf.onChange(raw === '' ? null : Number(raw));
            } else {
              cf.onChange(e.target.value);
            }
          }}
        />
      )}
    />
  );
}

export function ResourceForm({ resource, id, schema, fields, basePath, title }: ResourceFormProps) {
  const router = useRouter();
  const gqlFields = Array.from(new Set(['id', ...fields.map((f) => f.name)]));
  const {
    refineCore: { onFinish, formLoading, query },
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    refineCoreProps: {
      resource,
      id,
      action: id ? 'edit' : 'create',
      redirect: false,
      meta: { fields: gqlFields },
    },
    resolver: zodResolver(schema as any),
  });

  // Refine's own `redirect` option doesn't reliably navigate after a
  // successful edit mutation in this setup (create works, edit doesn't) —
  // so we drive navigation ourselves, always, right after the mutation
  // promise resolves. The record is confirmed saved by that point regardless.
  const submit = handleSubmit(async (values) => {
    await onFinish(values);
    router.push(basePath);
  });

  // Wait for the record to load before rendering the form. Without this,
  // react-hook-form's Controller fields can be filled by the user before the
  // fetched record arrives — @refinedev/react-hook-form then resets the form
  // to the fetched defaultValues, silently wiping out whatever was typed.
  const isInitialLoading = !!id && query?.isLoading;

  if (isInitialLoading) {
    return (
      <div className="p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">Loading...</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="grid gap-2">
                <Label htmlFor={f.name}>{f.label}</Label>
                {f.type === 'relation' && <RelationField field={f} control={control} />}
                {f.type === 'checkbox' && (
                  <Controller
                    name={f.name}
                    control={control}
                    render={({ field: cf }) => (
                      <Checkbox checked={!!cf.value} onCheckedChange={cf.onChange} />
                    )}
                  />
                )}
                {(!f.type || f.type === 'text' || f.type === 'number' || f.type === 'datetime-local') && (
                  <TextField field={f} control={control} />
                )}
                {errors[f.name] && (
                  <p className="text-destructive text-sm">{String(errors[f.name]?.message)}</p>
                )}
              </div>
            ))}
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => router.push(basePath)}>
                Cancel
              </Button>
              <Button type="submit" loading={formLoading}>
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
