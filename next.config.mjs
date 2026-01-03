/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'de-test-bucket-8285.s3.ap-south-1.amazonaws.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'de-test-bucket-8285.s3.ap-south-1.amazonaws.com',
          port: '',
          pathname: '/**',
          search: '**', // Allow signed URLs with query parameters
        },
        {
          protocol: 'https',
          hostname: 's3.ap-south-1.amazonaws.com',
          port: '',
          pathname: '/**',
          search: '**', // Allow signed URLs from regional endpoint
        },
      ],
      unoptimized: true, // Help with debugging and signed URLs
    },
  };
  
  export default nextConfig;