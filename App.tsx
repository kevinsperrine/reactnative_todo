import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default () => {
  const [todoList, setTodoList] = useState<{ [title: string]: boolean }>({
    test: false,
  });
  const [showDialog, setShowDialog] = useState(false);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    const loadTodos = async () => {
      const allTodos = await getAllItems();

      const todoObject = allTodos?.reduce((carry, [title, complete]) => {
        return {
          ...carry,
          [title as string]: complete,
        };
      }, {});

      setTodoList(todoObject as { [title: string]: boolean });
    };

    loadTodos();
  }, []);

  const deleteTodo = (title: string) => {
    setTodoList((prev) => {
      const { [title]: theTitle, ...rest } = prev;
      return rest;
    });
    deleteItem(title);
  };

  const addTodo = async (title: string) => {
    setTodoList({
      ...todoList,
      [title]: false,
    });
    saveItem(title, false);
  };

  const handleShowDialog = () => {
    setShowDialog(true);
  };

  const saveItem = async (title: string, complete: boolean) => {
    try {
      await AsyncStorage.setItem(title, complete ? "true" : "false");
    } catch (e) {
      // saving error
    }
  };

  const getItem = async (title: string) => {
    try {
      const value = await AsyncStorage.getItem(title);
      if (value !== null) {
        return value === "true" ? true : false;
      }
    } catch (e) {
      // error reading value
    }
  };

  const deleteItem = async (title: string) => {
    try {
      await AsyncStorage.removeItem(title);
    } catch (e) {
      // error
    }
  };

  const getAllItems = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return Promise.all(
        keys.map(async (key) => {
          const value = await getItem(key);
          return [key, value];
        })
      );
    } catch (e) {
      // error;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleShowDialog}>
        <Text style={styles.addButton}>+</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.heading}>To Do List</Text>
      </View>

      <View>
        <ScrollView style={{ paddingBottom: 16 }}>
          {Object.entries(todoList).map(([title, complete]) => {
            return (
              <View style={styles.listview}>
                <TouchableOpacity
                  onPress={() => {
                    setTodoList({
                      ...todoList,
                      [title]: !complete,
                    });
                    saveItem(title, !complete);
                  }}
                  style={{
                    marginRight: 16,
                  }}
                >
                  {complete ? (
                    <MaterialCommunityIcons
                      name="checkbox-marked-outline"
                      size={24}
                      color="rgba(0, 0, 0, 0.5)"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="checkbox-blank-outline"
                      size={24}
                      color="rgba(0, 0, 0, 0.5)"
                    />
                  )}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.textstyle,
                    {
                      textDecorationLine: complete ? "line-through" : undefined,
                    },
                  ]}
                >
                  {title}
                </Text>
                <TouchableOpacity onPress={() => deleteTodo(title)}>
                  <MaterialCommunityIcons
                    name="trash-can"
                    size={24}
                    color="rgba(0, 0, 0, 0.5)"
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
      {showDialog ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.40)",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              height: 150,
              width: 300,
              padding: 16,
              borderRadius: 4,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 16 }}>
              Add a task to your list
            </Text>
            <TextInput
              placeholder="Enter task here"
              style={{
                padding: 4,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0, 0, 0, 0.5)",
              }}
              onSubmitEditing={(e) => {
                addTodo(e.nativeEvent.text);
                setTodo("");
                setShowDialog(false);
              }}
              onChange={(e) => {
                setTodo(e.nativeEvent.text);
              }}
            ></TextInput>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 36,
              }}
            >
              <Pressable
                style={{
                  marginRight: 24,
                }}
                onPress={() => {
                  addTodo(todo);
                  setTodo("");
                  setShowDialog(false);
                }}
              >
                Add
              </Pressable>
              <Pressable
                onPress={() => {
                  setTodo("");
                  setShowDialog(false);
                }}
              >
                Cancel
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
  header: {
    flex: 1,
    height: 60,
  },
  textView: {
    backgroundColor: "#0091ea",
    height: 80,
  },
  heading: {
    textAlign: "center",
    fontSize: 18,
    color: "white",
    backgroundColor: "#0091ea",
    flex: 1,
    padding: 12,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    justifyItems: "center",
  },
  inputBox: {
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 20,
    height: 40,
  },
  button: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#0091ea",
    width: 46,
    height: 46,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },

  addButton: {
    color: "#fff",
    fontSize: 24,
  },
  textstyle: {
    fontSize: 16,
    textAlign: "left",
    flex: 1,
  },
  listview: {
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
    padding: 8,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: "space-between",
  },
});
