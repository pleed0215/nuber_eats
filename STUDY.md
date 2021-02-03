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

### 4. wrtieFragment vs Refetch

- cache를 업데이트하는 두 가지 방법.
  한가지는 위에서 다뤘고, 한가지는...
  useQuery 할 때,...
  ```ts
  const { data, refetch } = useQuery<QueryMe>(GQL_QUERY_ME);
  ```
  두번째 항목인 refetch에... 주목.
- 앞전의 방법은 백엔드에는 이미 데이터가 반영되었으니, 로컬에 빠르게 캐싱을 이용하여 데이터를 업데이트 할 수 있는 반면, refetch는 fetching을 다시하여 caching을 업데이트 한다.
- 결론은 똑같은데 코드가 줄어든다. 최적화하는 경우에는 캐싱을 직접 조작하는 경우가 더 나을 것 같다.

### 17.4 에서....

- input form의 onSubmit에서 history를 이용하여 term을 넘겨주는 redirecting을 하였는데, 기본적으로 form은 get method로 넘겨주는 방향이있는데.. 어째서.. 이렇게 했을가.. 궁금하다...
- 아마도 기본적인 방식은 알고 있을 것이니.. 이렇게 하면 customizing을 할 수 있다는 의미일까..
- data 보낼 때...
  - history에서 state를 이용하여 object를 데이터로 보낼 수 있다. 그러면 주소의 query param을 감출 수 있다.
  ```ts
  history.push({
    pathname: "/search",
    state: {
      searchTerm: "jlkajdf",
    },
  });
  ```
  이 state는 browser의 cache에 저장되기 때문에, refresh하여도 그대로 남아있는다..

### history.replace

- history.push와는 달리 history에 push를 추가하는 것이 아니라 말그대로 대체하는 것.

  1. /edit
  2. /search -> history.replace가 발생하면...
  3. /

  '/'에서는 search로 가는 주소가 기록에 남지 않는 것이다.

  ### fragment

  - fragment.tsx

```ts
export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantPart on Restaurant {
    id
    name
    coverImage
    category {
      id
      name
    }
    address
    isPromoted
  }
`;
```

- 사용할 때에는...

```ts
const GQL_SEARCH_BY_TERM = gql`
  query QuerySearchByTerm($term: String!, $page: Int!) {
    searchRestaurantByName(search: { query: $term, page: $page }) {
      ok
      error
      totalPages
      countTotalItems
      restaurants {
        # 이 부분과
        ...RestaurantPart
      }
    }
  }
  # 이부분에 주목..
  ${RESTAURANT_FRAGMENT}
`;
```

### useLazyQuery

- lazyQuery 리턴값의 첫번째는 함수인데, 그 함수를 실행해야... 쿼링이 시작된다.

```ts
const [queryReadyToStart, { loading, data, error }] = useLazyQuery<
  QuerySearchByTerm,
  QuerySearchByTermVariables
>(GQL_SEARCH_BY_TERM);
```

코드 예시..
queryReadyToStart를 호출하면 쿼링이 시작된다.

## 4. Client/Restaurant

- 순전히 front end인데 딱히 적을 부분은 없었다.

## 5. Test

- backend와 마찬가지로 jest를 이용하는데, create-react-app이라는 jest 설정된 패키지를 사용하는 모양이다.
- package.json에 추가.

```json
  "jest": {
    "collectCoverageFrom": [
      ".src/components/**/*.tsx",
      ".src/pages/**/*.tsx",
      ".src/routers/**/*.tsx"
    ]
  }
```

### App.spec.tsx

```ts
import { render } from "@testing-library/react";
import React from "react";

describe("<App />", () => {
  it("redners OK", () => {
    render;
  });
});
```

이 코드에서 보면 render에서 주목해야 할 것이 원래는, ReactDOM에서 import해서 실제 document에 rendering을 해주는 것인데, testing library에서 가져와서 render하는 즉, 가짜 rendering이라 보면 될 것 같다. 유사 렌더링.

- 처음 App을 테스트 해보면, apollo client 관련된 에러가 나오는데, 여기서는 신경 안써야 한다고 하더라.
- 왜냐하면 우리가 집중하는 부분은 react component들이기 때문...
- 그래서 apollo client관련된 부분은 mocking을 해야 한다.

App.test.tsx에서..

```ts
jest.mock("./routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});
```

- unit test 이기 때문에 unit과 관련 없는 부분은 component를 mocking 해줘야 함.

LoggedOutRouter를 mocking하는 부분..

#### render function

- debug

  - ReactDOM을 mocking한 render는 많은 함수를 가지고 있는 오브젝트이다. 강의에서는 그 중 debug를 호출해보는데, debug는 component들을 다 출력해주더라.

- getByText

  - text를 테스트 하는 함수. 입력된 텍스트와 출력된 테스트가 같지 않으면 에러가 발생한다.

-

#### react component update in test

- isLoggedInVar를 업데이트 해줘야 logged in으로 들어갈 수 있는데, 이부분에서 에러가 발생한다고 강의에서 나오지만, 나는 발생하지 않았는데 혹시 이것이 버전 업이 되면서 해결된 문제인가 싶긴하지만 일단 강의를 따라 가기로 하였다.
- waitFor에서는 state를 change하고 싶을 때.. 사용한다.

```ts
await waitFor(() => {
  isLoggedInVar(true);
});
```

- 이렇게 해줘야 한다고 한다.

#### const { container } = render ...

- vanilla js html element를 return 해준다고 한다.
- expect(container.firstChild).to~~~
  - 이런식으로 testing해주면 된다.

### --verbose flag it에 들어가있는 문구가 나오면서 테스팅 된다.

### npm i -D @testing-library/jest-dom@^4.2.4

- 이걸 설치해줘야 toHaveClass 같은 dom 관련 메소드를 사용할 수 있다.
- import "@testing-library/jest-dom/extend-expect"; 이걸 해줘야 함.

### mocking apollo client

- apollo client에서 이미 제공을 해줌.
- 방법은 두 가지가 있다. MockedProvder를 이용하거나 또는 createMockClient, MockApolloClient를 이용해 client를 mocking하거나.
- header를 테스팅할 때 useMe를 왠지 mocking해야 할 것 같은 느낌이 드는데, component안에서는 다른 함수들을 mocking 하면 안된다고 한다.
  - hook 자체를 mocking하면 안되고, hook의 결과를 mocking해야 한다.
  - MockedProvider는 mocks라는 것을 제공하는데, 이 object는 request와, result를 가지고 있는 오브젝트인데
    - request는 useQuery나 useMutation과 같은 옵션을 가지고 있어서, query와 variables를 가지고 있다.
    ```js
    const mocks = {
      request: {
        query: GET_DOG_QUERY,
        variables: {
          name: "Buck",
        },
      },
      result: {
        data: {
          dog: { id: 1, name: "Buck", breed: "bulldog" },
        },
      },
    };
    ```
  - mocking한 query는 너무 빨리 일어나기 때문에,
    ```js
    await new Promise((resolve) => setTimeout(resolve, 0));
    ```
    이렇게 해주라 함.

## 6. Cypress

> npm install cypress

하고 나서, example 지우고..
cypress 폴더에서 tsconfig.json을 만들자.
cypress 폴더에서 사용하는 tsconfig는 좀 다르다고 한다.

npm install --save-dev @testing-library/cypress

- testing library 사용하여 findBy.. 이런 류의 함수를 사용 할 때에는 chaining을 하면 안된다고 한다...
- 코드 참고하자.

### localStorage testing

> cy.window().its("localStorage.nuber_token").should("be.a", "string");

### intercept

- 사실 매번 테스트때마다 아이디가 생성되어야 한다면 그것도 문제이다. 우리는 백엔드를 테스트하는 것이 아니기 때문에 웬만하면, faking 된 데이터를 주는 것이 좋다.

그래서 사용하는 것이 intercept

- 모든 request에 대해서 intercept하면 안되기 때문에 일부만 intercept하는 것이 좋음.

- post의 경우 이렇게도 할 수 있는 모양..

```ts
user.intercept("POST", "http://lednas.yoyang.io:32789/graphql", (req) => {
  const { operationName } = req.body;
  if (operationName === "MutationUpdateProfile") {
    // @ts-ignore
    req.body?.variables.update.email = "email3@test.test";
  }
});
```

### Custom command

- 굉장히 쉽게 custom command를 추가할 수 있다.

```ts
Cypress.Commands.add("assertLoggedIn", () => {
  cy.window().its("localStorage.nuber_token").should("be.a", "string");
});
```

cypress/support/commands.ts에 보면 주석으로 잘 설명되어 있다.
혹시나 ts가 아닌 js라면... 확장자를 수정해주면 된다.

- login part가 반복되기 때문에 custom command로 만들어 놓았다 code확인하면 된다.
- jest 처럼 beforeEach, beforeAll 이 있다.

### fixture

cypress 폴더 안에 보면, fixture라는 폴더가 있다.
우버이츠 강의에 따르면(#19.7 5:40), testing하다보면 data intercepting을 여러번 할 경우가 있는데, 그럴 때 사용하는 것이라 한다.

1. 첫번째 스텝으로는 fixture 안에 intergration과 마찬가지의 구조로 auth폴더를 만들어 주고, 안에 create_account.json 파일도 만들어준다.

2. create_account.ts에서 intercepting한 data를 json화 해서 create_account.json에 넣어준다.

```json
// fixture/auth/create_account.json
{
  "data": {
    "createUser": {
      "ok": false,
      "error": null,
      "__typename": "CreateUserOutput"
    }
  }
}
```

3. intercepting할 때 주는 data를 아래와 같이 주면 된다.

```ts
// intergration/auth/create_account.ts
req.reply((res) => {
  res.send({
    fixture: "auth/create_account.json",
  });
});
```

## 7. Order Dash board

### 1. routes modify

- 기존의 routes들을 조금 변형해서 오브젝트 타입으로..
- 니코의 코드와는 조금 다르게 했다. tyepscript를 좀더 파고 싶어서..

### 2. file upload

- backend에 file upload 파트 추가.

  - nestjs에 쉽게 파일 upload 모듈을 만들 수가 있어서..
  - aws s3에 bucket을 만들었다.

- 알아둘점.

  - react form element는 enctype은 없고, encType은 있다.
  - file 관련된 타입은 FileList이다.

- 기본적으로 여기서 그냥 하면 CORS 에러가 난다.
  - No Access Control Allow Origin
  - 해결방법은 간단하게 backend의 main.ts에서 app.enableCors();를 추가하면 끝이다.

### 3. Creating dish & options

- dynamic 하게 options를 만든다.
- js에서 이건 알아둬야 할 것 같은게..

  ```js
    const {a, b, c, ...rest} = someObject;

    이렇게 하면 rest에는 a,b,c 를 제외한 나머지가 저장이 된다.
  ```

- useFieldArray를 사용하면 쉽게 dynamic 필드를 만들 수 있다.

### 4. Victory library.

- 쉽게 차트를 만들 수 있는 라이브러리.

### 5. date형식으로 만들기.

2020-12-24T07:23:17.244Z 이런 형식으로 되어 있는 것을.. 흔히 알고 있는 date형식으로 바꾸고 싶으면..
new Date("2020-12-24T07:23:17.244Z").toLocaleDateString()으로 해주면 된다.

....
front end 부분은 처음에 세팅과 낯선 환경으로 적을게 좀 많았지만 후반에는 정말 적을게 없다.

# 23 Order

## 0. Order Component

- 처음에 order 관련된 query를 만들고 나면, 이제 곧 subscription을 해야 하는데, backend 에서 설정해줬던 것처럼 front-end에서도 subscription에 대한 설정, 즉 웹 소켓에 관련된 설정을 해줘야 한다.

### apollo websocket 설정

- transport 설정이 가장 어려울 것이라 함.
- 먼저 subscriptions-transport-ws 라는 것을 설치해야 한다.

  > npm i subscriptions-transport-ws

- apollo client 설정, 여기서는 apollo.ts로 가서

  > import { WebSocketLink } from "@apollo/client/link/ws";

  를 추가해준다.

- 공식 문서와는 조금 차이가 있는 것 같다. 강의에서도 공식 문서를 참고하지만...
  [링크](https://www.apollographql.com/docs/react/data/subscriptions/#setting-up-the-transport)

추가되는 코드는 총..

```ts
const wsLink = new WebSocketLink({
  uri: WS_ENDPOINT,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);
```

### subscribeToMore

- subscribtion을 강의대로 했는데, 문제점은 우리가 서브스크립션한 내용이 query에 반영이 안되니까 데이터에 갭이 있더라..
- 이 부분은 이미 아폴로 클라이언트 만드는 사람들도 고민한 내용이다..
- 그래서 등장한 개념.
- useQuery의 리턴 값중 하나.
- useEffect에서 실행될 것이다.

#### type change in typescript

```ts
{ subscriptionData: { data },}: { subscriptionData: { data: OnOrderUpdate } }
```

니코가 집고 넘어간 부분이 있는데, subscribeToMore의 updateQuery는 function callback인데, 들어오는 argument들이 QueryOrderDetail이다. 이게 무슨 말인고 하면..
QueryOrderDetail의 return value는 backend에서 ok, error, order를 리턴을 해준다는 것.. 하지만 우리의 subscription에서는 order만을 리턴을 해주기 때문에 typescript에서는 불평을 한다.
위와 같이 코드를 작성하면, QueryOrderDetail을 subscription에서 리턴해주는 OnOrderUpdate type을 바꿔줄 수 있다는 의미. 이것은 ES6가 아니라 typescript 표현방식이라고 한다.

```ts
updateQuery: (
        prev,
        {
          subscriptionData: { data },
        }: { subscriptionData: { data: OnOrderUpdate } }
      ) => {
        if (!data) return prev;
        return {
          orderDetail: {
            ...prev.orderDetail,
            order: {
              ...data.orderUpdate,
            },
          },
        };
      },
```

이런 코드가 만들어질 것.

## 1. Driver Dashboard

### Googlemaps api

> npm i google-map-react

- @types가 없으므로 같이 install

### yesIWantToUseGoogleMapApiInternals

- GoogleMapReact component에 위 prop을 건네주면, googleApi를 사용할 수 있다.
- onGoogleApiloaded prop은 api가 loaded되었을 때 사용하는 콜백

#### onGoogleApiLoaded

- 콜백 함수 argument로 {map, maps} 두 가지가 있다.
  [Google Map Javascript Api](https://developers.google.com/maps/documentation/javascript/overview?hl=ko)

#### Child Component

- GoogleMapReact component의 child component들은 lat, lng prop을 주면 해당 위치에 맞게 렌더링을 해주는 기능이 있다.

```tsx
<GoogleMapReact>
  <div
    // @ts-ignore
    lng={lng}
    lat={lat}
    className="rounded-full w-8 h-8 bg-white flex justify-center items-center"
  >
    🚖
  </div>
</GoogleMapReact>
```

#### @types/googlemaps

- This package contains type definitions for Google Maps JavaScript API

#### directions api

- 방향 화살표 관련된 api

1.  GeoCoding

- 주소를 주면 좌표를 준다.

2. Reverse GeoCoding

- 반대로 좌표를 주면 주소로 준다.

apollo client 버그???

- apollo client 3.3.1 subscription 버그가 있나?? 3.2.7로 다운그레이드 했더니 괜찮아졌다.
