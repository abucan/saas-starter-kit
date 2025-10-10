import { requireUserId } from '@/lib/auth/session';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: '2MB' } })
    .middleware(async () => {
      const userId = await requireUserId();
      return { userId };
    })
    .onUploadComplete(async ({ file }) => {
      // TODO: You can store the uploaded URL in DB here if you want
      console.log('Upload complete:', file.ufsUrl);
    }),
} satisfies FileRouter;
