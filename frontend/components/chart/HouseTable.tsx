import { HouseCuspResponse } from "@/lib/types/api";
import { ZODIAC_GLYPHS, degreesToDMS } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/useI18n";

interface HouseTableProps {
  houses: HouseCuspResponse[];
}

const ANGULAR_HOUSES = [1, 4, 7, 10];
const HOUSE_NAMES: Record<number, string> = {
  1: "Ascendant",
  4: "IC",
  7: "Descendant",
  10: "Midheaven",
};

export function HouseTable({ houses }: HouseTableProps) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto rounded-xl border border-space-600/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-space-600/50 bg-space-800/80">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.house")}</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.sign")}</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.cusp")}</th>
          </tr>
        </thead>
        <tbody>
          {houses.map((house) => {
            const isAngular = ANGULAR_HOUSES.includes(house.house_number);
            return (
              <tr
                key={house.house_number}
                className="border-b border-space-700/30 last:border-0 hover:bg-space-700/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className={`font-medium ${isAngular ? "text-amber-400" : "text-slate-300"}`}>
                    {t("table.house")} {house.house_number}
                    {isAngular && (
                      <span className="ml-2 text-xs text-amber-500/70">
                        {t(`house.${house.house_number}`)}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-200">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-amber-400">
                      {ZODIAC_GLYPHS[house.sign]}
                    </span>
                    <span className="hidden sm:inline">{t(`sign.${house.sign.toLowerCase()}`)}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs hidden sm:table-cell">
                  {degreesToDMS(house.cusp_longitude)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
