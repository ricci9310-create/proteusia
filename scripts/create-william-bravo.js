// One-off: manually create William Bravo prospect (lost due to pre-fix bug in ContactCTA)
const fs = require('fs');
const path = require('path');
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
});
const { Client } = require('pg');

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const id = 'wb_' + Date.now().toString(36);
  const proteusProfile = {
    painLevel: 'unknown',
    infrastructure: 'Todo es manual',
    authority: 'unknown',
    industry: 'Servicios financieros',
    psychProfile: '',
    salesStrategy: 'Recuperado manualmente tras bug de ContactCTA (13-Apr-2026)',
    contactAction: 'call',
  };

  const res = await client.query(
    `INSERT INTO "Prospect"
      (id, name, "contactName", email, phone, channel, service, status, score, "proteusProfile", notes, "nextAction", "updatedAt", "createdAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8::"DealStatus",$9,$10,$11,$12, NOW(), NOW())
     RETURNING id, name, phone, service, "createdAt"`,
    [
      id,
      'Big Financial',
      'William Bravo',
      null,
      '316 6915614',
      'Proteus',
      'Planeación Financiera',
      'LEAD',
      null,
      proteusProfile,
      'Lead recuperado manualmente. Se perdió en formulario Proteus el 13-Apr-2026 por bug en ContactCTA (no validaba response.ok). Empresa Big Financial, interesado en planeación financiera.',
      'Llamar al lead',
    ]
  );

  console.log('Prospect created:', res.rows[0]);
  await client.end();
})().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
