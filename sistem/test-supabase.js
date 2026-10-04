import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envContent = fs.readFileSync(resolve(__dirname, '.env'), 'utf-8');
const envLines = envContent.split('\n');
const env = {};
envLines.forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

async function testConnection() {
  console.log("Checking Supabase connection via REST API...");
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/users?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Supabase Error:", errorText);
    } else {
      const data = await res.json();
      console.log(`Found ${data.length} users in database.`);
      if (data.length > 0) {
        console.log("First user:", data[0].username);
      }
    }
  } catch (err) {
    console.error("Network error:", err);
  }
}

testConnection();
