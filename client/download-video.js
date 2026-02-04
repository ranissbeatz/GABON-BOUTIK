const fs = require('fs');
const path = require('path');
const axios = require('axios');

const videoUrl = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/2/25/Market_Movements.webm/Market_Movements.webm.480p.vp9.webm';
const outputPath = path.resolve(__dirname, 'public', 'hero-video-small.webm');

const downloadVideo = async (url) => {
  console.log(`Attempting to download from: ${url}`);
  try {
    const writer = fs.createWriteStream(outputPath);

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
};

const main = async () => {
  try {
    await downloadVideo(videoUrl);
    console.log('Success! Video downloaded from Wikimedia Commons.');
  } catch (err) {
    console.error('Download failed.');
    console.error(err);
  }
};

main();
