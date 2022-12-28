/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  staticPageGenerationTimeout: 1000,
}

// fix for ZLIB error (https://github.com/ivansevillaa/use-next-blurhash/issues/4)
if (
  process.env.LD_LIBRARY_PATH == null
  || !process.env.LD_LIBRARY_PATH.includes(`${process.env.PWD}/node_modules/canvas/build/Release:`)
) {
  process.env.LD_LIBRARY_PATH = `${process.env.PWD}/node_modules/canvas/build/Release:${
    process.env.LD_LIBRARY_PATH || ''
  }`
}

module.exports = nextConfig
