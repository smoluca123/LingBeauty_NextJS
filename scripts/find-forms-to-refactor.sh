#!/bin/bash

# Script để tìm các forms cần refactor

echo "==================================="
echo "FORMS REFACTORING ANALYSIS"
echo "==================================="
echo ""

echo "1. Inline Schemas trong Components:"
echo "-----------------------------------"
grep -rn "const.*Schema = z\.object" client/src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v ".next"
echo ""

echo "2. Type Exports từ Schema Files:"
echo "-----------------------------------"
grep -rn "export type.*= z\.infer" client/src/lib/zod-schemas/ --include="*.ts" 2>/dev/null
echo ""

echo "3. Old Schema Imports:"
echo "-----------------------------------"
grep -rn "from '@/lib/zod-schemas" client/src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v ".next"
echo ""

echo "4. Files trong zod-schemas directory:"
echo "-----------------------------------"
ls -la client/src/lib/zod-schemas/ 2>/dev/null
echo ""

echo "==================================="
echo "REFACTORING RECOMMENDATIONS"
echo "==================================="
echo ""
echo "✅ Đã tạo cấu trúc mới:"
echo "  - client/src/lib/schemas/"
echo "  - client/src/lib/types/forms/"
echo ""
echo "📋 Cần làm tiếp:"
echo "  1. Di chuyển inline schemas ra files riêng"
echo "  2. Update imports trong components"
echo "  3. Xóa old zod-schemas directory sau khi migrate xong"
echo ""
