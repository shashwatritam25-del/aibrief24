import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://aibrief24.com',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
  ];
}
