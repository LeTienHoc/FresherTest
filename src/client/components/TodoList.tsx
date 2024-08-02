import { type SVGProps } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Tabs from '@radix-ui/react-tabs'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import { api } from '@/utils/client/api'
/**
 * QUESTION 3:
 * -----------
 * A todo has 2 statuses: "pending" and "completed"
 *  - "pending" state is represented by an unchecked checkbox
 *  - "completed" state is represented by a checked checkbox, darker background,
 *    and a line-through text
 *
 * We have 2 backend apis:
 *  - (1) `api.todo.getAll`       -> a query to get all todos
 *  - (2) `api.todoStatus.update` -> a mutation to update a todo's status
 *
 * Example usage for (1) is right below inside the TodoList component. For (2),
 * you can find similar usage (`api.todo.create`) in src/client/components/CreateTodoForm.tsx
 *
 * If you use VSCode as your editor , you should have intellisense for the apis'
 * input. If not, you can find their signatures in:
 *  - (1) src/server/api/routers/todo-router.ts
 *  - (2) src/server/api/routers/todo-status-router.ts
 *
 * Your tasks are:
 *  - Use TRPC to connect the todos' statuses to the backend apis
 *  - Style each todo item to reflect its status base on the design on Figma
 *
 * Documentation references:
 *  - https://trpc.io/docs/client/react/useQuery
 *  - https://trpc.io/docs/client/react/useMutation
 *
 *
 *
 *
 *
 * QUESTION 4:
 * -----------
 * Implement UI to delete a todo. The UI should look like the design on Figma
 *
 * The backend api to delete a todo is `api.todo.delete`. You can find the api
 * signature in src/server/api/routers/todo-router.ts
 *
 * NOTES:
 *  - Use the XMarkIcon component below for the delete icon button. Note that
 *  the icon button should be accessible
 *  - deleted todo should be removed from the UI without page refresh
 *
 * Documentation references:
 *  - https://www.sarasoueidan.com/blog/accessible-icon-buttons
 *
 *
 *
 *
 *
 * QUESTION 5:
 * -----------
 * Animate your todo list using @formkit/auto-animate package
 *
 * Documentation references:
 *  - https://auto-animate.formkit.com
 */
export const TodoList = () => {
  type TrangThai = 'pending' | 'completed'
  const { data: todos = [] } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  })
  const { data: pendings = [] } = api.todo.getAll.useQuery({
    statuses: ['pending'],
  })
  const { data: completed = [] } = api.todo.getAll.useQuery({
    statuses: ['completed'],
  })
  const handleCheckBox = (status: string) => {
    if (status === 'completed') {
      return true
    }
    return false
  }
  const apiContext = api.useContext()
  const { mutate: updateTodo } = api.todoStatus.update.useMutation({
    onSuccess: () => {
      apiContext.todo.getAll.refetch()
    },
  })
  const { mutate: deleteTodo } = api.todo.delete.useMutation({
    onSuccess: () => {
      apiContext.todo.getAll.refetch()
    },
  })
  const [parent] = useAutoAnimate()
  const CheckedStatus = (status: string, id: number) => {
    let checkStatus: TrangThai = 'pending'
    if (status === 'pending') {
      checkStatus = 'completed'
    }
    updateTodo({
      todoId: id,
      status: checkStatus,
    })
  }
  const ActiveCss = (status: string, css: string) => {
    if (status === 'completed') {
      return css
    }
    return ''
  }
  return (
    <Tabs.Root defaultValue="tab1" orientation="vertical">
      <Tabs.List
        aria-label="tabs example"
        className="mb-4 flex items-center justify-start gap-2"
      >
        <Tabs.Trigger
          className="text-gray-700 rounded-full border border-gray-200 px-6 py-3 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
          value="tab1"
        >
          All
        </Tabs.Trigger>
        <Tabs.Trigger
          className="text-gray-700 rounded-full border border-gray-200 px-6 py-3 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
          value="tab2"
        >
          Pending
        </Tabs.Trigger>
        <Tabs.Trigger
          className="text-gray-700 rounded-full border border-gray-200 px-6 py-3 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
          value="tab3"
        >
          Completed
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <ul className="grid grid-cols-1 gap-y-3" ref={parent}>
          {todos.map((todo) => (
            <li key={todo.id}>
              <div
                className={`flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm 
                            ${ActiveCss(todo.status, 'bg-gray-50')}`}
              >
                <Checkbox.Root
                  id={String(todo.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
                  checked={handleCheckBox(todo.status)}
                  onCheckedChange={() => {
                    CheckedStatus(todo.status, todo.id)
                  }}
                >
                  <Checkbox.Indicator>
                    <CheckIcon className="h-4 w-4 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>

                <label
                  className={`block pl-3 text-base font-medium 
                                  ${ActiveCss(
                                    todo.status,
                                    'text-gray-500 line-through'
                                  )}`}
                  htmlFor={String(todo.id)}
                >
                  {todo.body}
                </label>
                <button
                  className="ml-auto"
                  onClick={() => {
                    deleteTodo({ id: todo.id })
                  }}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <ul className="grid grid-cols-1 gap-y-3" ref={parent}>
          {pendings.map((pending) => (
            <li key={pending.id}>
              <div
                className={`shadow-sm} flex items-center rounded-12 border border-gray-200 px-4 py-3`}
              >
                <Checkbox.Root
                  id={String(pending.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none"
                  onCheckedChange={() => {
                    CheckedStatus(pending.status, pending.id)
                  }}
                >
                  <Checkbox.Indicator>
                    <CheckIcon className="h-4 w-4 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>

                <label
                  className={`text-base} block pl-3 font-medium`}
                  htmlFor={String(pending.id)}
                >
                  {pending.body}
                </label>
                <button
                  className="ml-auto"
                  onClick={() => {
                    deleteTodo({ id: pending.id })
                  }}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <ul className="grid grid-cols-1 gap-y-3" ref={parent}>
          {completed.map((complete) => (
            <li key={complete.id}>
              <div
                className={`bg-gray-50} flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm`}
              >
                <Checkbox.Root
                  id={String(complete.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
                  checked={true}
                  onCheckedChange={() => {
                    CheckedStatus(complete.status, complete.id)
                  }}
                >
                  <Checkbox.Indicator>
                    <CheckIcon className="h-4 w-4 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>

                <label
                  className={`block pl-3 text-base font-medium text-gray-500 line-through`}
                  htmlFor={String(complete.id)}
                >
                  {complete.body}
                </label>
                <button
                  className="ml-auto"
                  onClick={() => {
                    deleteTodo({ id: complete.id })
                  }}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Tabs.Content>
    </Tabs.Root>
  )
}

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}
