/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { Status, TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos } from './api';

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => alert('Could not load the todos'))
      .finally(() => setIsLoading(false));
  }, []);

  return { todos, isLoading };
};

interface Filters {
  query: string;
  status: Status;
}

const getFilteredTodos = (todos: Todo[], { query, status }: Filters) => {
  let filteredTodos = [...todos];

  const normQuery = query.trim().toLowerCase();

  if (normQuery) {
    filteredTodos = filteredTodos.filter(todo => {
      const normTodoTitle = todo.title.trim().toLowerCase();

      return normTodoTitle.includes(normQuery);
    });
  }

  if (status !== 'all') {
    filteredTodos = filteredTodos.filter(todo => {
      return status === 'completed' ? todo.completed : !todo.completed;
    });
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const { todos, isLoading: isLoadingTodos } = useTodos();

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('all');

  const onSelectTodo = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const onUnselectTodo = () => setSelectedTodo(null);

  const filteredTodos = getFilteredTodos(todos, { query, status });

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                query={query}
                setQuery={setQuery}
                status={status}
                setStatus={setStatus}
              />
            </div>

            <div className="block">
              {isLoadingTodos && <Loader />}

              {!isLoadingTodos && (
                <TodoList
                  todos={filteredTodos}
                  selectedTodo={selectedTodo}
                  onSelectTodo={onSelectTodo}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal todo={selectedTodo} onClose={onUnselectTodo} />
      )}
    </>
  );
};
