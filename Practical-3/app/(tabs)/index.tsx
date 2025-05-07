import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Todo, todoService } from '@/shared/services/todoService';


export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const loadTodos = async () => {
    const { data, error } = await todoService.getAllTodos();
    if (!error && data) {
      setTodos(data);
    } else {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async () => {
    if (text.trim() === '') return;

    const newTodo: Omit<Todo, 'id' | 'created_at'> = {
      text: text.trim(),
      completed: false,
    };

    const { data, error } = await todoService.addTodo(newTodo);
    if (!error && data) {
      setTodos([data[0], ...todos]);
      setText('');
    }
  };

  const deleteTodo = async (id: number) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await todoService.deleteTodo(id);
            if (!error) {
              setTodos(todos.filter(todo => todo.id !== id));
              if (editingId === id) {
                setEditingId(null);
              }
            }
          }
        }
      ]
    );
  };

  const toggleTodo = async (id: number, currentStatus: boolean) => {
    const { error } = await todoService.toggleTodoStatus(id, currentStatus);
    if (!error) {
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    }
  };

  const startEditing = (id: number, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = async () => {
    if (editingId && editText.trim() !== '') {
      const { error } = await todoService.updateTodo(editingId, { text: editText.trim() });
      if (!error) {
        setTodos(
          todos.map(todo =>
            todo.id === editingId ? { ...todo, text: editText.trim() } : todo
          )
        );
        setEditingId(null);
        setEditText('');
      }
    }
  };

  const renderTodoItem = ({ item }: { item: Todo }) => {
    if (item.id === editingId) {
      return (
        <ThemedView style={styles.editItemContainer}>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
            autoFocus
            onSubmitEditing={saveEdit}
            onBlur={saveEdit}
          />
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.todoItem}>
        <TouchableOpacity
          onPress={() => toggleTodo(item.id!, item.completed)}
          style={styles.checkboxContainer}
        >
          {item.completed ? (
            <Ionicons name="checkbox" size={24} color="#4CAF50" />
          ) : (
            <Ionicons name="square-outline" size={24} color="#757575" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.todoTextContainer}
          onPress={() => startEditing(item.id!, item.text)}
        >
          <ThemedText
            style={[
              styles.todoText,
              item.completed && styles.completedText
            ]}
          >
            {item.text}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteTodo(item.id!)}
          style={styles.deleteButton}
        >
          <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />

      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>TODO LIST</ThemedText>
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="add item..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <ThemedText style={styles.addButtonText}>ADD</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {todos.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            No tasks yet. Add some!
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={item => item.id!.toString()}
          style={styles.list}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#333',
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 4,
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteButton: {
    backgroundColor: '#ff5252',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  editItemContainer: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  editInput: {
    fontSize: 16,
    padding: 8,
  },
});
