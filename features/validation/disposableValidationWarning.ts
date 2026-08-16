import type { EmailValidationResult } from './types';

export interface DisposableValidationWarning {
  title: string;
  message: string;
}

export function getDisposableValidationWarning(
  result: Pick<EmailValidationResult, 'emailType'>,
): DisposableValidationWarning | null {
  if (result.emailType !== 'disposable') return null;

  return {
    title: 'Disposable email detected',
    message:
      'This address uses a temporary email provider. We recommend not using it. Mailbox probing was skipped because the domain is classified as disposable.',
  };
}
