import mongoose from 'mongoose';

export interface Site {
  sitename: string;
  siteno: string;
}


const siteSchema = new mongoose.Schema<Site>({
  sitename: String,
  siteno: String,
});

export const SiteModel = mongoose.model<Site>('Site', siteSchema);
