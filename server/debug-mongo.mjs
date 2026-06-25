import dns from 'dns'
import net from 'net'
import tls from 'tls'
import { MongoClient } from 'mongodb'

dns.setServers(['8.8.8.8', '8.8.4.4'])

const URI = process.env.MONGODB_URI || process.argv[2]
if (!URI) {
  console.error('Usage: node debug-mongo.mjs "mongodb+srv://..."')
  process.exit(1)
}

console.log('\n=== DeadlineAI MongoDB Diagnostics ===\n')
console.log('Node version  :', process.version)
console.log('Platform      :', process.platform, process.arch)
console.log('URI scheme    :', URI.split('://')[0])

// Extract cluster hostname from URI
const host = URI.replace('mongodb+srv://', '').replace('mongodb://', '').split('@')[1]?.split('/')[0] ?? 'unknown'
console.log('Cluster host  :', host)

// ── Step 1: SRV resolution ─────────────────────────────────────────────────
console.log('\n[1] SRV DNS Resolution...')
try {
  const srvName = `_mongodb._tcp.${host}`
  const records = await dns.promises.resolveSrv(srvName)
  console.log('    ✅ SRV resolved:', records.length, 'hosts')
  records.forEach(r => console.log(`       ${r.name}:${r.port} priority=${r.priority}`))

  // ── Step 2: TCP connect to first shard ──────────────────────────────────
  const firstHost = records[0]
  console.log(`\n[2] TCP connect to ${firstHost.name}:${firstHost.port}...`)
  await new Promise((resolve, reject) => {
    const sock = net.createConnection({ host: firstHost.name, port: firstHost.port }, () => {
      console.log('    ✅ TCP connection established')
      sock.destroy()
      resolve(null)
    })
    sock.setTimeout(8000)
    sock.on('error', (e) => { console.log('    ❌ TCP error:', e.message); reject(e) })
    sock.on('timeout', () => { console.log('    ❌ TCP timeout'); sock.destroy(); reject(new Error('timeout')) })
  }).catch(() => {})

  // ── Step 3: TLS handshake ────────────────────────────────────────────────
  console.log(`\n[3] TLS handshake to ${firstHost.name}:${firstHost.port}...`)
  await new Promise((resolve) => {
    const sock = tls.connect({ host: firstHost.name, port: firstHost.port, servername: firstHost.name }, () => {
      console.log('    ✅ TLS handshake succeeded')
      console.log('       Protocol :', sock.getProtocol())
      console.log('       Cipher   :', sock.getCipher()?.name)
      console.log('       Cert CN  :', sock.getPeerCertificate()?.subject?.CN ?? 'n/a')
      sock.destroy()
      resolve(null)
    })
    sock.setTimeout(8000)
    sock.on('error', (e) => { console.log('    ❌ TLS error:', e.message); sock.destroy(); resolve(null) })
    sock.on('timeout', () => { console.log('    ❌ TLS timeout'); sock.destroy(); resolve(null) })
  })

} catch (srvErr) {
  console.log('    ❌ SRV resolution failed:', srvErr.message)
  console.log('    Stopping — fix DNS first')
  process.exit(1)
}

// ── Step 4: MongoClient direct connection ────────────────────────────────────
console.log('\n[4] MongoClient connection attempt...')
const client = new MongoClient(URI, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 15000,
  tls: true,
  tlsAllowInvalidCertificates: false,
})

try {
  await client.connect()
  console.log('    ✅ MongoClient connected')
  const db = client.db('admin')
  const ping = await db.command({ ping: 1 })
  console.log('    ✅ Ping response:', JSON.stringify(ping))
  await client.close()
} catch (e) {
  console.log('    ❌ MongoClient error:', e.message)
  console.log('       Error name :', e.name)
  console.log('       Error code :', e.code ?? 'none')
  if (e.cause) console.log('       Cause      :', e.cause.message ?? e.cause)
  
  // Try with TLS validation disabled to isolate TLS vs auth
  console.log('\n[4b] Retrying with TLS validation disabled...')
  const client2 = new MongoClient(URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
  })
  try {
    await client2.connect()
    console.log('    ✅ Connected with TLS validation disabled — TLS cert issue confirmed')
    await client2.close()
  } catch (e2) {
    console.log('    ❌ Still failing with TLS disabled:', e2.message)
    console.log('       This rules out TLS cert as the cause')
  }
}

// ── Step 5: Check driver version ─────────────────────────────────────────────
console.log('\n[5] Driver versions...')
try {
  const { createRequire } = await import('module')
  const req = createRequire(import.meta.url)
  const mongoVer = req('./node_modules/mongodb/package.json').version
  const mongooseVer = req('./node_modules/mongoose/package.json').version
  console.log('    mongodb driver :', mongoVer)
  console.log('    mongoose       :', mongooseVer)
} catch {
  console.log('    (run from server directory to see versions)')
}

console.log('\n=== Diagnostics complete ===\n')