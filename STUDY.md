# Nuber eats front-end

## 1. install

### CRA

> npx create-react-app nuber-eats --template typescript

### tailwindcss

홈페이지에서 tailwindcss 설치 방법 참고해서 설치 및 설정.

### apollo

apollo 홈페이지 참고해서 설치

## 2. Authentication

### 1. Local Only Fields

[공식문서](https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/)

- local query를 이용하는 방법.

code

```ts
export const apolloClient = new ApolloClient({
  uri: "http://lednas.yoyang.io:32789/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read(existing, options) {
              return Boolean(localStorage.getItem("token"));
            },
          },
        },
      },
    },
  }),
});
```

    - read에 보면 변수가 두가지인데, existing은 잘 모르겠고, options는 variables나 storage 등의 많은 정보가 같이 딸려 온다.

#### storing local state in reactive varaibles

[링크](https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/#storing-local-state-in-reactive-variables)

Apollo Client reactive variables are great for representing local state:

- You can read and modify reactive variables from anywhere in your application, without needing to use a GraphQL operation to do so.
- Unlike the Apollo Client cache, reactive variables don't enforce data normalization, meaning you can store data in any format you want.
- If a field's value depends on the value of a reactive variable, and that variable's value changes, every active query that includes the field automatically refreshes.

local variable을 저장하고 읽어 올 수 있는 기능.

> export const cartItemsVar = makeVar([]);

- This initializes a reactive variable that contains an empty array. We can get this variable's current value by calling cartItemsVar(), and we can set a new value by calling cartItemsVar(newValue).
- 이것을 이용하면 매번 로컬 변수가 필요할 때마다 query를 할 필요가 없다.
- useQuery를 이용안해도 된다. userReactiveVar를 이용해보자.

### 2. React hook form

- 사실 리액트에서 폼 만들기는 정말 뻑킹스럽다. 그래서 쓰는 패키지.

기본 예시 코드.

```ts
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => console.log(data);
  const onInvalid = ()=> console.log("Cannot create");

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
    {/* register your input into the hook by invoking the "register" function */}
      <input name="example" defaultValue="test" ref={register({validate: (email:string) => email.includes("@gmail.com")})} />

      {/* include validation with required or other standard HTML validation rules */}
      <input name="exampleRequired" ref={register({ required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
```

- sample code에서 register required 사용할 때 굳이 input에 required를 주지 않았다는 것을 확인하자.
  - required 옵션을 줄 때에는 메시지로 줄 수도 있다.
- error 사용하는 방법도 확인.
- validating 하는 방법 확인
- onInvalid도 확인.
- pattern을 처리할 수도 있다. 정규식으로..

리액트에서 사실.. 위의 폼을 만드려면 useState 남발해야 하는데.. 데이터 관리도 어렵다.

- interface를 이용하여 typescript를 활용해도 괜찮다.

```ts
interface IForm {
  email: string;
  password: string;
}
useForm<IForm>();
```

- inteerface 대신 type을 써도 괜찮은 모양이다.

  #### Resolver

  ```ts
  import { Resolver, useForm } from "react-hook-form";

  const resolver: Resolver<FormValues> = async (values) => {
    return {
      values: values.firstName ? values : {},
      errors: !values.firstName
        ? {
            firstName: {
              type: "required",
              message: "This is required.",
            },
          }
        : {},
    };
  };
  ```

  - custom validation을 만들 때 유용하다고 한다.

### 3. useMutation & apollo codegen

1. apollo codegen 검색해서 페이지 들어가서 패키지 인스톨 필요.

   > npm install -g apollo & npm install apollo

2. install 후에는 apollo.config.js 만들어주자.

```js
module.exports = {
  client: {
    include: ["src/**/*.tsx"],
    tagName: "gql",
    service: {
      name: "nuber-eats-backend",
      url: "http://lednas.yoyang.io:32789/graphql",
      // optional headers
      headers: {
        authorization: "Bearer lkjfalkfjadkfjeopknavadf",
      },
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
};
```

3. 콘솔에서 명령어 입력해서 code generating 하기

   > apollo client:codegen OUTPUT --target typescript

4. useMutation with typescript

- generating 된 파일

```ts
export interface LoginMutation_login {
  __typename: "LoginOutput";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface LoginMutation {
  login: LoginMutation_login;
}

export interface LoginMutationVariables {
  email: string;
  password: string;
}
```

- useMutation이렇게 사용하면된다.
  > useMutation<LoginMutation, LoginMutationVariables>();
- 예를들어 문자가 들어가야 할 곳에, 숫자가 들어가는 등 typescript 활용하는 방법이라 생각하면 될 듯하다.

- useMutation의 options에는 onComplete, onError가 있다.
  - onCompete는 data가 넘겨지며, onError는 ApolloError가 넘겨진다.
  - useMutation에서 굳이 {loading, error, data}까지 쓸 필요는 없을 것 같다.

### 4. rimraf

- rm -rf on node
  - mac 이외의 os에서도 rm -rf를 할 수 있도록 해주는 패키지.
