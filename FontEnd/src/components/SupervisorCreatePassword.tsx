import { getNextSpPasswordStart, patchSpPassword } from "@/services/users";
import { Button } from "@/ui/Button";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useQuery } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import { IGetUser } from "@/types/user";
import { toast } from "react-toastify";
import useLoadingStore from "@/store/loadingStore";

interface SupervisorCreatePasswordProps {
  profile: IGetUser | undefined;
  refetchProfile: () => void;
}
export const SupervisorCreatePassword = ({
  profile,
  refetchProfile,
}: SupervisorCreatePasswordProps) => {
  const [spPassword, setSpPassword] = useState("");

  const { setIsLoading } = useLoadingStore();

  const { data } = useQuery({
    queryKey: ["getNextSpStart", profile?._id],
    enabled: !!profile?._id,
    queryFn: getNextSpPasswordStart,
  });
  console.log(data);
  const nextInitialCode = data?.nextInitialCode;

  const handleCreateSpPassword = async () => {
    if (!profile?._id) return;
    setIsLoading(true);
    try {
      const response = await patchSpPassword(profile?._id, spPassword);
      toast.success("Senha criada com sucesso!", { theme: "colored" });
      setIsLoading(false);

      refetchProfile();
      return response;
    } catch (err) {
      console.log(err);
      toast.error("Erro ao criar senha", { theme: "colored" });
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  if (nextInitialCode)
    return (
      <div className="flex flex-col gap-3 mb-5">
        <Subtitle variant="large-semibold">
          Crie sua senha de supervisor
        </Subtitle>
        <Caption variant="large-semibold">
          Digite os 4 últimos números da sua senha:
        </Caption>

        <div className="flex items-end gap-1.5  flex-row ">
          <InputOTP
            onChange={(str) => {
              console.log(str);
            }}
            value={String(nextInitialCode)}
            maxLength={4}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup>
              {String(nextInitialCode)
                .split("")
                ?.map((_item, index) => (
                  <InputOTPSlot
                    className="bg-neutral-50"
                    index={index}
                    key={index}
                  />
                ))}
            </InputOTPGroup>
          </InputOTP>
          <InputOTP
            onChange={(str) => {
              console.log(spPassword);
              setSpPassword(str);
              console.log(str);
            }}
            value={spPassword}
            maxLength={4}
            onEnded={(str) => {
              console.log(str);
            }}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPSeparator onClick={(e) => console.log(e)} />

            <InputOTPGroup>
              <InputOTPSlot hideValue={spPassword.length > 1} index={0} />
              <InputOTPSlot hideValue={spPassword.length > 2} index={1} />
              <InputOTPSlot hideValue={spPassword.length > 3} index={2} />
              <InputOTPSlot hideValue={spPassword.length >= 4} index={3} />
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={() => {
              handleCreateSpPassword();
            }}
            disabled={spPassword.length !== 4}
            className=" ml-6 -my-0 text-sm disabled:opacity-50 max-h-9"
            variant="primary"
          >
            Salvar Senha de Supervisão
          </Button>
        </div>
        <Caption variant="large">
          Anote sua senha, ela será importante para seu papel de supervisor!
        </Caption>
      </div>
    );
  return <></>;
};
