require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const VNDB_API_URL = 'https://api.vndb.org/kana/ulist';
const VNDB_VN_URL = 'https://api.vndb.org/kana/vn';
const VNDB_USER = 'u257101';
const API_KEY = process.env.VNDB_API_KEY;

async function fetchUserList() {
  const res = await axios.post(
    VNDB_API_URL,
    {
      user: VNDB_USER,
      filters: ['label', '=', 7], // filter has finished
      sort: "vote",
      reverse: true,
      fields: "id, vote, voted, vn.title, vn.released, vn.image.url",
      results: 100
    },
    {
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data.results;
}

(async () => {
  try {
    if (!API_KEY) {
      throw new Error('VNDB_API_KEY 环境变量未设置');
    }

    console.log('正在获取用户评分列表...');
    const userList = await fetchUserList();
    console.log(`获取到 ${userList.length} 个评分`);

    const result = userList.map(item => ({
      id: item.id,
      title: item.vn.title || '',
      released: item.vn.released || '',
      image: item.vn.image.url || '',
      vote: item.vote / 10,
      finished: item.voted,
    }));


    const outputPath = path.join(__dirname, '../public/my_galgame.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`数据已保存到 ${outputPath}`);
  } catch (e) {
    console.error('拉取或写入失败:', e.message);
    if (e.response) {
      console.error('API响应:', e.response.data);
    }
    process.exit(1);
  }
})(); 