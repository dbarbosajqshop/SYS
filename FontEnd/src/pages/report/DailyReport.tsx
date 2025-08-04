import { MONTHS_LONG, PAYMENT_TYPES, WEEKDAYS_SHORT } from "@/constants";
import { buildCalendar, formatMoney } from "@/helpers";
import { useDailyReport } from "@/hooks/useDailyReport";
import { ArrowBack } from "@/icons/ArrowBack";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { IDay } from "@/types/reports";
import { IconButton } from "@/ui/IconButton";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function DailyReport() {
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth() + 1);
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());

  const navigate = useNavigate();

  const { report, loading, fetchReport } = useDailyReport();

  useEffect(() => {
    fetchReport({ year: displayYear, month: displayMonth });
  }, [displayMonth, displayYear]);

  const calendar = buildCalendar(displayYear, displayMonth, report.report || []);

  const handleChangeMonth = (_date: dayjs.Dayjs, dateString: string | string[]) => {
    if (!dateString) {
      setDisplayMonth(new Date().getMonth() + 1);
      setDisplayYear(new Date().getFullYear());
      return;
    }
    const str = Array.isArray(dateString) ? dateString[0] ?? "" : dateString;
    const [month, year] = str.split("/");
    setDisplayMonth(parseInt(month, 10));
    setDisplayYear(parseInt(year, 10));
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
        <Subtitle variant="large-semibold">Relatório de vendas diária</Subtitle>
        {loading ? (
          <SpinningLogo />
        ) : (
          <div className="overflow-x-auto">
            <div className="flex w-full items-center justify-between gap-6 mb-2">
              <Subtitle variant="large-semibold">
                {MONTHS_LONG[displayMonth - 1]} {displayYear}
              </Subtitle>

              <DatePicker
                className="h-12 w-full max-w-48"
                onChange={handleChangeMonth}
                picker="month"
                format={"MM/YYYY"}
                value={dayjs(
                  `${displayMonth.toString().padStart(2, "0")}/${displayYear}`,
                  "MM/YYYY"
                )}
                maxDate={dayjs()}
              />
            </div>
            <div className="border border-neutral-200 rounded p-3 bg-neutral-50 flex flex-col gap-2 mb-4">
              <Subtitle variant="large-semibold" color="text-neutral-700">
                Total do mês
              </Subtitle>
              <ul className="text-sm text-neutral-600">
                {PAYMENT_TYPES.map((type) => (
                  <li key={type.key} className="flex justify-between">
                    <Subtitle variant="small">{type.label}</Subtitle>
                    <Subtitle variant="small-semibold">
                      {formatMoney(
                        report.totalMonth[type.key as keyof typeof report.totalMonth]
                      )}
                    </Subtitle>
                  </li>
                ))}
              </ul>
              <Subtitle variant="large-semibold">
                Total: {formatMoney(report.totalMonth.total)}
              </Subtitle>
            </div>
            <table className="min-w-full border-separate border-spacing-2">
              <thead>
                <tr>
                  {WEEKDAYS_SHORT.map((wd) => (
                    <th key={wd} className="text-center text-neutral-500 font-semibold">
                      <Subtitle variant="large">{wd}</Subtitle>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calendar.map((week, i) => (
                  <tr key={i}>
                    {week.map((day, j) => {
                      let isFuture = false;
                      if (day) {
                        const today = new Date();
                        const cellDate = new Date(displayYear, displayMonth - 1, day.day);
                        today.setHours(0, 0, 0, 0);
                        cellDate.setHours(0, 0, 0, 0);
                        isFuture = cellDate > today;
                      }
                      return (
                        <td
                          key={j}
                          className={`align-top bg-neutral-100 border border-neutral-200 rounded p-2 min-w-48 w-48 h-48 ${
                            day &&
                            !isFuture &&
                            "hover:border-brand-600 hover:border-2 transition-colors duration-300"
                          }`}
                        >
                          {day ? (
                            isFuture ? (
                              <div className="flex flex-col gap-1 h-full items-center justify-center">
                                <Subtitle
                                  variant="small"
                                  color="text-neutral-400"
                                  className="border border-dashed border-neutral-300 rounded px-2 py-1"
                                >
                                  Dia {day.day}
                                </Subtitle>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1 h-full">
                                <Subtitle
                                  variant="small"
                                  color="text-neutral-0"
                                  className="bg-brand-600"
                                >
                                  Dia {day.day}
                                </Subtitle>
                                <ul className="text-xs text-neutral-600 flex-1">
                                  {PAYMENT_TYPES.map((type) => (
                                    <li key={type.key} className="flex justify-between">
                                      <Caption variant="small">{type.label}</Caption>
                                      <Caption variant="small-semibold">
                                        {formatMoney(day[type.key as keyof IDay])}
                                      </Caption>
                                    </li>
                                  ))}
                                </ul>
                                <Caption
                                  variant="large-semibold"
                                  className="text-right mt-1"
                                >
                                  Total: {formatMoney(day.total)}
                                </Caption>
                              </div>
                            )
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
