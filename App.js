import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import styled from 'styled-components';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
//삭제 기능을 사용하기 위해 lodash를 사용.
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage.setItem('test', 'test value')
//   .then( () => {
//     alert('저장됨');
//   })
//   .catch( error => {
//     alert(error.message);
//   })
const Container = styled.SafeAreaView`
  flex : 1;
  padding-top : ${Constants.statusBarHeight}px;

`;

const InputContainer = styled.View`
  flex-direction : row;
  padding: 8px;
`;
const Input = styled.TextInput`
  border : 1px solid #e5e5e5;
  flex: 1;
`;
const Contents = styled.ScrollView`
  flex: 1;
`;

const KeyboardAvoingView = styled.KeyboardAvoidingView`
  flex: 1;
`;

const Button = styled.Button`

`;
const TodoItem = styled.View`
  flex-direction : row;
  border: 1px solid #ff0000;
`;
const TodoItemText = styled.Text`
  flex: 1;
  padding : 8px;
  font-size: 24px;
`;
const TodoItemButton = styled.Button`

`;
const Text = styled.Text`
  font-size: 24px;

`;
const Check = styled.TouchableOpacity`
  margin-right : 4px;
  align-items: center;
  justify-content: center;
`;

const CheckIcon = styled.Text`
  margin-left: 4px;
  font-size: 20px;
`;
// Promise : 비동기를 다루를 방식 ( 콜백을 사용하지 않고)
// async (function) + await  : Promise를 확장한것


export default function App() {

  React.useEffect(() => {
    AsyncStorage.getItem('list')
      .then(data => {
        if (data !== null) {
          setList(JSON.parse(data));
        }
      })
      .catch(error => {
        alert(error.message)
      })


  }, []);

  const store = (newList) => {
    setList(newList);
    AsyncStorage.setItem('list', JSON.stringify(newList));
  }


  const [list, setList] = useState([]);

  const [inputTodo, setInputTodo] = useState('');

  // {} 사이에는 컴포넌트 혹은 컴포넌트로 이루어진 배열을 리턴할 수 있음.
  /*
  
  return (
    <>
      <Text>hi</Text>
    </>

    )
    혹은

    return (
      [
        <Text> hi 1 </Text>,
        <Text> hi 2 </Text>,
        <Text> hi 3 </Text>,
        <Text> hi 4 </Text>,
      ]
    )
  
  
  
  */

  return (
    <Container>
      <KeyboardAvoingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        <Contents>
          {
            list.map(item => {
              return (
                <TodoItem key={item.id}>
                  <Check>
                    <CheckIcon>
                      {item.done ? '✅' : '☑️'}
                    </CheckIcon>
                  </Check>
                  <TodoItemText>{item.todo}</TodoItemText>
                  <TodoItemButton title="삭제" onPress={() => {
                    const rejectedList = _.reject(list, element => element.id === item.id)
                    // const aa = _.remove(lifst, (listItem)=> {listItem.id === item.id})
                    store(rejectedList);
                    // store(aa);
                  }} />
                </TodoItem>
              )
            })
          }

        </Contents>
        <InputContainer>
          <Input
            value={inputTodo}
            onChangeText={value => setInputTodo(value)} />
          <Button
            title="전송"
            onPress={() => {
              // push : 새로운 배열을 리턴하는게 아닌, 원본 배열을 수정함.
              // inputTodo.push( {...} );

              if (inputTodo === '') {
                return;
              }

              const newItem = {
                id: new Date().getTime().toString(),
                todo: inputTodo,
                done: false,
              };

              // store((prev)=>{return ([...prev, newItem])});
              store([...list, newItem]);
              setInputTodo('');
            }} />
        </InputContainer>
      </KeyboardAvoingView>

    </Container>
  );
}
