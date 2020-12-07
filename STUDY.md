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
