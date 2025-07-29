# Environment Variables Setup Guide

This guide will help you set up all the necessary environment variables for the AI Component Generator (AiGenZone).

## Quick Start (Minimal Setup)

For a basic working setup, you only need these essential variables:

1. **Copy the minimal template:**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. **Set up Supabase:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Go to Settings > API
   - Copy your Project URL and anon key

3. **Get Google AI API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key

4. **Generate JWT Secret:**
   \`\`\`bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   \`\`\`

## Full Setup (All Features)

### 1. Supabase Configuration

\`\`\`bash
# Required for authentication and database
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
\`\`\`

**Setup Steps:**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > API
4. Copy Project URL and API keys
5. Run the SQL schema from `create-tables.sql`

### 2. AI Provider APIs

\`\`\`bash
# Google Generative AI (Primary)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key

# OpenAI (Optional alternative)
OPENAI_API_KEY=your-openai-api-key

# Anthropic Claude (Optional alternative)
ANTHROPIC_API_KEY=your-anthropic-api-key
\`\`\`

**Setup Steps:**
- **Google AI**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- **OpenAI**: Visit [OpenAI API](https://platform.openai.com/api-keys)
- **Anthropic**: Visit [Anthropic Console](https://console.anthropic.com/)

### 3. Database (Choose One)

**Option A: MongoDB**
\`\`\`bash
MONGODB_URI=mongodb://localhost:27017/aigenzone
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aigenzone
\`\`\`

**Option B: PostgreSQL**
\`\`\`bash
DATABASE_URL=postgresql://username:password@localhost:5432/aigenzone
\`\`\`

### 4. Redis (Optional - for caching)

\`\`\`bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
\`\`\`

**Setup Steps:**
1. Install Redis locally or use Redis Cloud
2. For local: `brew install redis` (Mac) or `sudo apt install redis` (Ubuntu)
3. Start Redis: `redis-server`

### 5. Security

\`\`\`bash
# Generate a strong JWT secret
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
\`\`\`

**Generate JWT Secret:**
\`\`\`bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python -c "import secrets; print(secrets.token_hex(32))"
\`\`\`

## Environment-Specific Files

### Development (.env.local)
\`\`\`bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEBUG=true
LOG_LEVEL=debug
\`\`\`

### Production (.env.production)
\`\`\`bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
DEBUG=false
LOG_LEVEL=error
\`\`\`

### Testing (.env.test)
\`\`\`bash
NODE_ENV=test
NEXT_PUBLIC_APP_URL=http://localhost:3001
DATABASE_URL=postgresql://localhost:5432/aigenzone_test
\`\`\`

## Verification

After setting up your environment variables, verify they're working:

\`\`\`bash
# Check if all required variables are set
npm run check-env

# Start the development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/health
\`\`\`

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use different keys** for development and production
3. **Rotate API keys** regularly
4. **Use environment-specific** configurations
5. **Validate environment variables** on startup

## Troubleshooting

### Common Issues:

1. **Supabase Connection Failed**
   - Check if URL and keys are correct
   - Verify project is not paused
   - Check network connectivity

2. **AI API Errors**
   - Verify API key is valid
   - Check API quotas and billing
   - Ensure correct model names

3. **Database Connection Issues**
   - Check connection string format
   - Verify database is running
   - Check firewall settings

4. **Missing Environment Variables**
   - Use `npm run check-env` to verify
   - Check file naming (.env.local vs .env)
   - Restart development server after changes

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all required variables are set
3. Test API endpoints individually
4. Check the application logs
5. Refer to the documentation of each service
