import { supabase } from "@/lib/supabase";

// Define TypeScript interfaces for better type safety
export interface Todo {
  id?: number;
  text: string;
  completed: boolean;
  created_at?: string;
}

export interface TodoResponse {
  data: Todo[] | null;
  error: any;
}


// Todo service - handles all Supabase interactions for todos
 
export const todoService = {
  async addTodo(todo: Omit<Todo, 'id' | 'created_at'>): Promise<TodoResponse> {
    const { data, error } = await supabase
      .from('todos')
      .insert(todo)
      .select();

    return { data, error };
  },

  async deleteTodo(id: number): Promise<{ error: any }> {
    console.log("Calling Supabase to delete ID:", id);
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) console.error("Supabase delete error:", error);
    return { error };
  },

  async updateTodo(id: number, updates: Partial<Omit<Todo, 'id' | 'created_at'>>): Promise<{ error: any }> {
    const { error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id);

    return { error };
  },

  async upsertTodo(todo: Todo): Promise<TodoResponse> {
    const { data, error } = await supabase
      .from('todos')
      .upsert(todo)
      .select();

    return { data, error };
  },

  async getAllTodos(): Promise<TodoResponse> {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async toggleTodoStatus(id: number, currentStatus: boolean): Promise<{ error: any }> {
    return this.updateTodo(id, { completed: !currentStatus });
  }
};
