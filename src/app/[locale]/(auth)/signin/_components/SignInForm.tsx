'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRoot,
  Input,
  useToast,
} from '@paalan/react-ui';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';

import Link from '@/components/Link';
import { useSession } from '@/stores/session-store';
import { api } from '@/trpc/client';
import {
  signInValidationSchema,
  type SignInValidationSchemaType,
} from '@/validations/auth.validation';

type SignInFormProps = {};
export const SignInForm: FC<SignInFormProps> = _props => {
  const session = useSession();
  const toast = useToast();

  const form = useForm({
    resolver: zodResolver(signInValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signInMutation = api.auth.signIn.useMutation({
    onSuccess(data) {
      if (!data) {
        toast.error('Failed to sign in');
        return;
      }
      session.update(data);
      toast.success('Signed in successfully');
    },
    onError(error) {
      toast.error(error.message || 'Failed to sign in');
      session.update(null);
    },
  });

  const onSubmit = async (credentials: SignInValidationSchemaType) => {
    signInMutation.mutate({ credentials });
  };

  const isSubmitting = signInMutation.isPending || session.status === 'loading';

  return (
    <FormRoot {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input id="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input id="password" placeholder="Enter your password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </FormRoot>
  );
};
