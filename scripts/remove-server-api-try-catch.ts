#!/usr/bin/env node
/**
 * Script to remove try-catch blocks from server API functions
 * Server API functions should let HTTPError bubble up naturally
 * proxyRoute() in route handlers will handle error forwarding
 */

import * as fs from 'fs'
import * as path from 'path'

const SERVER_API_DIR = path.join(__dirname, '../src/lib/apis/server')

/**
 * Remove try-catch wrapper from a function
 */
function removeTryCatch(content: string): string {
  // Pattern: try { return await ... } catch (error) { if (error instanceof HTTPError) { ... } throw error }

  // This regex matches the try-catch pattern and extracts just the return statement
  const pattern =
    /try \{\s*(return await [^}]+\.json<[^>]+>\(\))\s*\} catch \(error\) \{\s*if \(error instanceof HTTPError\) \{[^}]+\}\s*throw error\s*\}/gs

  return content.replace(pattern, (match, returnStatement) => {
    return returnStatement
  })
}

/**
 * Process a single file
 */
function processFile(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8')
  const newContent = removeTryCatch(content)

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8')
    return true
  }

  return false
}

/**
 * Process all TypeScript files in directory
 */
function processDirectory(dir: string): number {
  let filesModified = 0
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory() && entry.name !== 'actions') {
      // Skip actions directory - those use proxyRoute pattern
      continue
    }

    if (
      entry.isFile() &&
      entry.name.endsWith('.ts') &&
      !entry.name.endsWith('.d.ts')
    ) {
      if (processFile(fullPath)) {
        console.log(
          `✅ Removed try-catch from: ${path.relative(process.cwd(), fullPath)}`,
        )
        filesModified++
      }
    }
  }

  return filesModified
}

// Main execution
console.log('🔧 Removing try-catch blocks from server API functions...\n')

const filesModified = processDirectory(SERVER_API_DIR)

console.log(`\n✅ Complete! Modified ${filesModified} files.`)
console.log('\nServer API functions now let HTTPError bubble up naturally.')
console.log('proxyRoute() in route handlers will handle error forwarding.')
