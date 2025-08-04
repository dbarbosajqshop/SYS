import { Logo } from "@/assets/Logo";
import { Close } from "@/icons/Close";
import { Button } from "@/ui/Button";
import { Caption } from "@/ui/typography/Caption";
import { Heading } from "@/ui/typography/Heading";
import { Link } from "@/ui/typography/Link";
import { Paragraph } from "@/ui/typography/Paragraph";
import { SquareInput } from "@/ui/typography/SquareInput";
import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  email: string;
};

export const LoginModal = ({ onClose, open, email }: Props) => {
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    if (!open) return setCodeSent(false);
    if (codeSent) {
      const timer = setTimeout(() => {
        setCodeSent(false);
        console.log(code); // This is the line that needs to be removed
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [codeSent, open]);

  return (
    <div
      className={`${
        open ? "absolute" : "hidden"
      } w-full sm:w-screen h-screen p-xs sm:p-xl bg-neutral-0`}
    >
      <div className="flex items-center justify-between">
        <Logo />
        <Close onClick={onClose} />
      </div>
      <div className="flex flex-col gap-4 justify-center sm:w-[400px] text-wrap mx-auto h-full">
        <div>
          <Heading variant="medium">Enviamos um código</Heading>
          <Heading variant="medium">para o seu e-mail </Heading>
        </div>
        <div>
          <Paragraph variant="large-semibold" color="text-neutral-500">
            Enviamos um código de redefinição de senha
          </Paragraph>
          <Paragraph variant="large-semibold" color="text-neutral-500">
            para o e-mail <b>{email}</b>
          </Paragraph>
        </div>
        <Paragraph variant="large-semibold">Código</Paragraph>
        <SquareInput onValueChange={setCode} />
        <div>
          <Button wide onClick={onClose}>
            Continuar
          </Button>
          {!codeSent ? (
            <Link
              onClick={() => setCodeSent(true)}
              variant="medium"
              className="text-center"
            >
              Reenviar código
            </Link>
          ) : (
            <>
              <Caption variant="large" className="text-center">
                Novo código enviado verifique seu e-mail.
              </Caption>
              <Caption variant="large" className="text-center" color="text-neutral-500">
                Reenviar código em 30 seg
              </Caption>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
