import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import {
  MutationVerifyCode,
  MutationVerifyCodeVariables,
} from "../../codegen/MutationVerifyCode";
import { useMe } from "../../hooks/useMe";
import { useQueryParam } from "../../hooks/useQueryParam";

const GQL_VERIFICATION = gql`
  mutation MutationVerifyCode($code: String!) {
    verifyCode(code: $code) {
      ok
      error
    }
  }
`;

/* Todo:
    add sendVerification mutation on backend.
*/

export const VerificationPage = () => {
  const history = useHistory();
  const onVerifyCompleted = (data: MutationVerifyCode) => {
    const {
      verifyCode: { ok },
    } = data;

    if (ok && userData?.me?.id) {
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
      toast.success("Success to comfirm your verification.");
      setTimeout(() => history.push("/"), 2000);
    } else {
      toast.error("Verification of your email address is not valid.");
    }
  };
  const [verifyCode, { loading, data, error }] = useMutation<
    MutationVerifyCode,
    MutationVerifyCodeVariables
  >(GQL_VERIFICATION, { onCompleted: onVerifyCompleted });

  const queryParam = useQueryParam();
  const client = useApolloClient();
  const { data: userData } = useMe();

  useEffect(() => {
    const code = queryParam.get("code");

    if (code) {
      verifyCode({
        variables: {
          code,
        },
      });
    }
  }, []);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      {loading ? (
        <h1 className="text-lg mb-2 font-medium">
          Confirming your verification.. Please wait..
        </h1>
      ) : !error && data?.verifyCode.ok ? (
        <h1 className="text-lg mb-2 font-medium">
          Your verification is confirmed. Please log in.
        </h1>
      ) : (
        <div>
          <h1 className="text-lg mb-2 font-medium">
            Couldn't confirm your email verification.
          </h1>
          <p>Message: {data?.verifyCode.error} </p>
        </div>
      )}
    </div>
  );
};
