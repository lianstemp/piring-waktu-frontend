# Piring Waktu Database Schema

This directory contains the database schema and migrations for the Piring Waktu application.

## Setup Instructions

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

### 2. Run the Migration
1. Copy the contents of `migrations/001_initial_schema.sql`
2. Go to your Supabase dashboard → SQL Editor
3. Paste and run the migration script

### 3. Seed Initial Data (Optional)
1. Copy the contents of `seed.sql`
2. Run it in the SQL Editor to populate initial recipe data

### 4. Configure Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase project URL and anon key from the project settings

## Database Structure

### Core Tables

#### `profiles`
- User profiles automatically created from auth.users
- Stores display name, avatar, username, bio

#### `recipes`
- Master recipe data with ingredients, steps, history
- Includes metadata like difficulty, prep time, servings
- Tagged for easy searching and categorization

#### `chat_sessions`
- User chat sessions with AI
- Each session has a title and belongs to a user

#### `chat_messages`
- Individual messages within chat sessions
- Can reference recipes suggested or selected
- Stores both user and AI messages

#### `saved_recipes`
- Recipes bookmarked by users
- Links back to the chat session/message where it was saved
- Allows personal notes

#### `cooked_recipes`
- Recipes that users have actually cooked
- Includes user photos, reviews, ratings
- Privacy setting for community sharing
- Links back to originating chat context

#### `community_interactions`
- Likes, comments, shares on cooked recipes
- Powers the community engagement features

### Views

#### `community_feed`
- Pre-joined view of public cooked recipes with interaction counts
- Optimized for displaying the community page

#### `user_saved_recipes_with_context`
- User's saved recipes with chat context information
- Shows which conversation led to saving each recipe

#### `user_cooked_recipes_with_context`
- User's cooked recipes with chat context information
- Shows which conversation led to cooking each recipe

## Key Features

### Chat Context Tracking
- Every saved or cooked recipe remembers which chat conversation it came from
- Users can navigate back to the original conversation
- Provides context for why they saved/cooked a particular recipe

### Privacy Controls
- Users can choose to make cooked recipes public or private
- Public recipes appear in the community feed
- Private recipes are for personal tracking only

### Community Engagement
- Like, comment, and share cooked recipes
- View others' cooking results and reviews
- Learn from the community's experiences

### Automatic Profile Creation
- New users automatically get a profile created from their auth data
- Handles Google OAuth and other auth providers seamlessly

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Public data (recipes, community feed) accessible to all authenticated users
- Proper policies prevent unauthorized access

## Performance

- Indexes on frequently queried columns
- Views for complex joins to reduce query complexity
- Efficient pagination support for community feed

## Usage with Next.js

The `lib/supabase.js` file provides helper functions for all database operations:

```javascript
import { supabase, saveRecipe, getCommunityFeed } from '@/lib/supabase'

// Save a recipe
await saveRecipe(userId, recipeId, sessionId, messageId)

// Get community feed
const feed = await getCommunityFeed(20, 0)
```

## Migration Notes

- The schema uses UUID primary keys for better scalability
- JSONB columns for flexible data storage (ingredients, steps, tags)
- Timestamps with timezone for proper date handling
- Unique constraints to prevent duplicate saves/cooks per user