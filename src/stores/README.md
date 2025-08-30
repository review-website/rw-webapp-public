# Zustand Store 使用指南

本项目使用 Zustand 作为状态管理解决方案。Zustand 是一个轻量级、易用的状态管理库，相比 Redux 更简单，比 Context API 更高效。

## 已创建的 Store

### 1. Modules Store (`modulesStore.ts`)
管理模组相关的状态，包括：
- 模组列表数据
- 分页信息
- 搜索查询
- 加载状态
- 错误状态

**使用方法：**
```tsx
import { useModulesStore } from '@/stores';

function MyComponent() {
  const { 
    modules, 
    loading, 
    error, 
    fetchModules, 
    searchModules 
  } = useModulesStore();
  
  // 使用状态和方法
}
```

### 2. Voting Store (`votingStore.ts`)
管理投票相关的状态，包括：
- 选中的标签
- 投票提交状态
- 历史投票记录
- 投票操作（提交、重新投票等）

**使用方法：**
```tsx
import { useVotingStore } from '@/stores';

function VotingComponent() {
  const { 
    selectedSubcategories, 
    hasVoted, 
    submitVote, 
    toggleSubcategory 
  } = useVotingStore();
  
  // 使用投票状态和方法
}
```

### 3. User Store (`userStore.ts`)
管理用户相关的状态，包括：
- 用户认证状态
- 用户信息
- 投票历史

**使用方法：**
```tsx
import { useUserStore } from '@/stores';

function UserProfile() {
  const { 
    isAuthenticated, 
    username, 
    voteHistory 
  } = useUserStore();
  
  // 使用用户状态
}
```

## 主要优势

1. **类型安全**: 完整的 TypeScript 支持
2. **性能优化**: 自动的组件重渲染优化
3. **开发体验**: 简洁的 API，易于学习和使用
4. **状态持久化**: 可以轻松集成 localStorage 等持久化方案
5. **调试友好**: 支持 Redux DevTools

## 迁移指南

### 从自定义 Hooks 迁移

**之前 (useModules hook):**
```tsx
const { modules, loading, fetchModules } = useModules();
```

**现在 (Zustand store):**
```tsx
const { modules, loading, fetchModules } = useModulesStore();
```

### 状态更新

**之前:**
```tsx
const [modules, setModules] = useState([]);
setModules(newModules);
```

**现在:**
```tsx
const { modules, setModules } = useModulesStore();
setModules(newModules);
```

## 最佳实践

1. **按功能模块拆分 store**: 每个 store 负责特定的业务领域
2. **使用 selector 优化性能**: 只订阅需要的状态
3. **保持 store 简单**: 避免在一个 store 中管理过多状态
4. **异步操作**: 在 store 中处理异步逻辑，保持组件简洁

## 扩展建议

未来可以考虑添加：
- 持久化中间件 (zustand/middleware)
- 状态同步 (zustand/middleware/sync)
- 状态分片 (zustand/slice)
- 开发工具集成

## 示例组件

参考 `ModuleListWithStore.tsx` 了解如何在组件中使用 Zustand store。 