import { toast } from 'sonner';
export function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!navigator.clipboard) {
      return reject(new Error('Clipboard API not supported'));
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function copyToClipboardWithToast(text: string): Promise<void> {
  return copyToClipboard(text)
    .then(() => {
      toast.success('Ссылка успешно скопирована');
    })
    .catch(() => {
      toast.error('Не удалось скопировать ссылку');
    });
}
