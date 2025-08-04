import { useEffect, useState } from "react";
import { useMonthlyReport } from "@/hooks/useMonthlyReport";
import { MONTHS_LONG, PAYMENT_TYPES } from "@/constants";
import { formatMoney } from "@/helpers";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { IconButton } from "@/ui/IconButton";
import { ArrowBack } from "@/icons/ArrowBack";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function MonthlyReport() {
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const { report, loading, fetchReport } = useMonthlyReport();

  const navigate = useNavigate();

  useEffect(() => {
    fetchReport({ year: displayYear });
  }, [displayYear]);

  const handleChangeMonth = (_date: dayjs.Dayjs, dateString: string | string[]) => {
    if (!dateString) {
      setDisplayYear(new Date().getFullYear());
      return;
    }
    setDisplayYear(
      Array.isArray(dateString) ? parseInt(dateString[0], 10) : parseInt(dateString, 10)
    );
  };

  return (
    <div className="flex flex-col gap-6 py-sm px-sm sm:px-md bg-neutral-100 h-full">
      <div className="flex items-center gap-3">
        <IconButton size="large" iconColor="#71717A" onClick={() => navigate("/report")}>
          <ArrowBack />
        </IconButton>
        <Subtitle variant="medium" color="text-neutral-500">
          Relatórios
        </Subtitle>
      </div>
      <div className="flex flex-col min-h-[50vh] gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
        <Subtitle variant="large-semibold">Relatório de vendas mensais</Subtitle>
        {loading ? (
          <SpinningLogo />
        ) : (
          <>
            <div className="flex w-full items-center justify-between gap-6 mb-2">
              <Subtitle variant="large-semibold">{displayYear}</Subtitle>
              <DatePicker
                className="h-12 w-full max-w-48"
                onChange={handleChangeMonth}
                picker="year"
                value={dayjs(`${displayYear}`, "YYYY")}
                maxDate={dayjs()}
              />
            </div>
            <div className="border border-neutral-200 rounded p-3 bg-neutral-50 flex flex-col gap-2 mb-4">
              <Subtitle variant="large-semibold" color="text-neutral-700">
                Total do ano
              </Subtitle>
              <ul className="text-sm text-neutral-600">
                {PAYMENT_TYPES.map((type) => (
                  <li key={type.key} className="flex justify-between">
                    <Subtitle variant="small">{type.label}</Subtitle>
                    <Subtitle variant="small-semibold">
                      {formatMoney(
                        report.totalYear[type.key as keyof typeof report.totalYear]
                      )}
                    </Subtitle>
                  </li>
                ))}
              </ul>
              <Subtitle variant="large-semibold">
                Total: {formatMoney(report.totalYear.total)}
              </Subtitle>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {report.report?.map((monthData) => (
                <div
                  key={monthData.month}
                  className="border border-neutral-200 rounded p-3 bg-neutral-50 flex flex-col gap-2 hover:border-brand-600 hover:border-2 transition-colors duration-300"
                >
                  <Subtitle
                    variant="small"
                    color="text-neutral-0"
                    className="bg-brand-600"
                  >
                    {MONTHS_LONG[monthData.month - 1]}
                  </Subtitle>
                  <ul className="text-sm text-neutral-600">
                    {PAYMENT_TYPES.map((type) => (
                      <li key={type.key} className="flex justify-between">
                        <Caption variant="large">{type.label}</Caption>
                        <Caption variant="large-semibold">
                          {formatMoney(monthData[type.key as keyof typeof monthData])}
                        </Caption>
                      </li>
                    ))}
                  </ul>
                  <Subtitle variant="large-semibold" className="text-right mt-1">
                    Total: {formatMoney(monthData.total)}
                  </Subtitle>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
