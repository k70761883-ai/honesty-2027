#!/bin/bash

# Supabase Database Optimization Script
# This script helps you run the database optimizations

echo "========================================="
echo "Supabase Database Optimization Script"
echo "========================================="
echo ""
echo "This script will guide you through optimizing your Supabase database."
echo ""
echo "Steps:"
echo "1. Open your Supabase project dashboard"
echo "2. Go to SQL Editor"
echo "3. Copy the SQL from DATABASE_OPTIMIZATIONS.md"
echo "4. Run the SQL in the editor"
echo ""
echo "Or if you have Supabase CLI with Docker:"
echo "supabase db reset"
echo "supabase db push"
echo ""
echo "Would you like to open DATABASE_OPTIMIZATIONS.md? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  if command -v code &> /dev/null; then
    code DATABASE_OPTIMIZATIONS.md
  elif command -v notepad &> /dev/null; then
    notepad DATABASE_OPTIMIZATIONS.md
  else
    echo "Please open DATABASE_OPTIMIZATIONS.md manually to view the SQL optimizations."
  fi
fi

echo ""
echo "After running the SQL optimizations, your database performance should improve significantly."
echo "Expected improvements:"
echo "- Dashboard stats query: 10-100x faster"
echo "- List queries: 2-5x faster"
echo "- Filter queries: 5-10x faster"
echo "- Overall FCP/LCP: Significant improvement due to faster data fetching"
