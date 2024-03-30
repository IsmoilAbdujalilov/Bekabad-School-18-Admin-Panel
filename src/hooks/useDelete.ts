import { get } from "lodash";
import { api, storage } from "services";
import { useMutation } from "@tanstack/react-query";

type typeUseDelete = {
  path: string;
  queryKey: string;
  onError: (data: unknown) => void;
  onSuccess: (data: unknown) => void;
};

const useDelete = ({
  path = "",
  onError = () => {},
  onSuccess = () => {},
}: typeUseDelete) => {
  const response = useMutation({
    mutationFn: (id: string) => {
      return api
        .delete(`${path}/${id}`, {
          headers: {
            Authorization: `Bearer ${storage.get("token")}`,
          },
        })
        .then((response) => {
          return get(response, "data");
        });
    },
    onError: (error) => onError(error),
    onSuccess: (successData) => onSuccess(successData),
  });
  return response;
};

export default useDelete;
