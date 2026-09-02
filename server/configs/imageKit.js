import ImageKit from '@imagekit/nodejs';
import "dotenv/config";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "dummy_private_key_to_prevent_import_crash",
});

export default imagekit;