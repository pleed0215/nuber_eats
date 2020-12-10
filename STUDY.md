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

### 5. formState (useForm, react-hook-form)

- isValid를 사용하려면 onChange, onBlur 모드에서 가능.
  - onChange는 매 입력이 발생할 때마다, onBlur는 focusing이 바뀔 때마다 일어나나 보다..

### 6. useReactiveVar

- makeVar 사용 시 요걸 해줘야 값이 업데이트 될 때 호출되는 값도 바뀌는 갑다..

### 7. useHistory

- react router dom 에서 redirect나 페이지 이동 등을 사용하고 싶을 때..
  - redirect
  ```js
  const history = useHistory();
  history.push("/");
  ```

### 8. React helmet async

- 기존의 react helmet은 warning을 내뿜는다.. 수정된 버전인갑다..
- warning이기 때문에 설치 하든 말든 자기 마음임.
- helmet과는 다르게 HelmetProvider로 전체 앱을 감싸줘야 한다.

### 9. apollo server에 token을 넘겨주려면..?

- apollo-link 페이지에 가보면 많은 링크가 있는데, 일단 여기서 사용할 것들은, apollo-http-link, apollo-ws-link 둘.

```ts
const httpLink = createHttpLink({
  uri: "http://lednas.yoyang.io:32789/graphql",
});

const authLink = setContext((request, prevContext) => {
  return {
    headers: {
      ...prevContext.headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
```

### 10. Router & Switch & Route

- Switch의 유무에 따라 Route의 행동 양식이 다르다.

  - 일반적으로 routing을 하고 싶으면 switch를 사용하는 것이 맞다.
  - 그냥 Route를 사용하면 Route에 해당하는 모든 것들이 렌더링이 되는데..
  - Switch를 사용하면.. 해당 path만 렌더링 된다.

  #### 여기서 재밌는 점이 하나 발견된다.

  Switch의 바로 밑의 children이 route가 되어야 한다.
  처음에 강의에서 아래와 같이 코드를 작성했다.

  ```ts
  const ClientRoutes = () => (
    <>
      <Route exact path="/">
        <Restaurants />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </>
  );

  export const LoggedInRouter = () => {
    ....

    return (
      <Router>{data.me.role === UserRole.Client && <ClientRoutes />}</Router>
    );
  }
  ```

  - 이 코드의 문제점이 바로 ClientRoutes에서 Fragment를 사용했다는 것.. 그라믄 원하는대로 Switch가 작동하지않아 모든 Route에 해당하는 것을 렌더링 해뻘인다.
  - 그래서 위의 코드는 아래와 같이 해괴망측한 코드가 되어야 한다고 한다.

  ```ts
  const ClientRoutes =  [
      <Route exact path="/">
        <Restaurants />
      </Route>
      <Route>
        <NotFound />
      </Route>
  ];

  export const LoggedInRouter = () => {
    ....

    return (
      <Router>{data.me.role === UserRole.Client && ClientRoutes }</Router>
    );
  }
  ```

  - 정밀 기괴하고 룰에서 벗어난 코드인 것처럼 보인다.

### 11. Container

- tailwindcss 2.0부터는 기능이 상당히 많아졌다.
- max-w-screen-lg, max-w-7xl 이런것들..

### 12. React Fontawesome

- 검색해서 관련 패키지 인스톨하면 된다. 사용방법이 쉽다.

### 13. apollo 관련된 hook

- useMe 관련된 hook을 만들었는데, 여기서는 여러번 query를 하는 것 같아서 걱정했는데, apollo에서 자동으로 caching을 하니까 걱정 말고 써도 된다고 한다.

## 3. User Pages

verify, edit profile, etc..

### 1. useLocation

- 주소를 얻어오는 방법. react router dom.

### 2. URLSearchParams

https://reactrouter.com/web/example/query-parameters

- react router dom 을 쓸 때 search에서 query param 분리하는 코드.

### 3. reading and writing data to the cache..

- readQuery & readFragment
- writeQuery & writeFragment
- cache.modify(a method of InMemoryCache)

- chrome의 확장 apollo에 가보면, cache항목에 있는데 apollo가 똑똑해서 우리가 쿼링이나 mutation한 것들을 캐싱 해놓는다.

- email verify를 해서 우리가 verification을 완료 했다고 가정을 했을 때, 과연 자동으로 verification이 된 것으로 알고 있을까.. 생각해보면 아니라는 걸 알 수 있다.
- 그래서 fragment로 일부 타입을 수정을 해줘야 한다.

```ts
const client = useApolloClient();
client.writeFragment({
  id: userData?.me?.id.toString(),
  fragment: gql`
    fragment VerifiedUser on User {
      verified
    }
  `,
  data: {
    verified: true,
  },
});
```
