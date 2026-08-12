import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type Props = {
  report: {
    report_type?: string;
    symbol_a?: string | null;
    symbol_b?: string | null;
    title?: string | null;
    result_json?: any;
    created_at?: string | null;
  };
};

const styles = StyleSheet.create({
  page: {
    padding: 42,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
    backgroundColor: "#ffffff",
  },

  eyebrow: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 22,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },

  card: {
    border: "1 solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    color: "#6b7280",
  },

  value: {
    fontWeight: "bold",
  },

  body: {
    lineHeight: 1.55,
  },

  bullet: {
    marginBottom: 5,
  },

  footer: {
    marginTop: 22,
    paddingTop: 12,
    borderTop: "1 solid #e5e7eb",
    fontSize: 8,
    color: "#9ca3af",
  },
});

function safeText(
  value: unknown,
  fallback = "Insufficient evidence.",
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);
}

function List({
  items,
}: {
  items?: unknown[];
}) {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return (
      <Text style={styles.body}>
        Insufficient evidence.
      </Text>
    );
  }

  return (
    <View>
      {items.slice(0, 12).map(
        (item, index) => (
          <Text
            key={index}
            style={styles.bullet}
          >
            - {safeText(item)}
          </Text>
        ),
      )}
    </View>
  );
}

function DeepReport({
  data,
}: {
  data: any;
}) {
  const report =
    data?.report ?? {};

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Executive Thesis
        </Text>

        <Text style={styles.body}>
          {safeText(
            report.executive_thesis,
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Research Confidence
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>
              Research Confidence
            </Text>

            <Text style={styles.value}>
              {safeText(
                report.research_confidence,
                "0",
              )}
              %
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Gateway Confidence
            </Text>

            <Text style={styles.value}>
              {safeText(
                data?.gateway_confidence,
                "0",
              )}
              %
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Research Dimensions
        </Text>

        {Object.entries(
          report.dimensions ?? {},
        ).map(
          ([key, value]: [
            string,
            any,
          ]) => (
            <View
              key={key}
              style={styles.card}
            >
              <Text style={styles.value}>
                {key
                  .replaceAll(
                    "_",
                    " ",
                  )
                  .toUpperCase()}
              </Text>

              <Text style={styles.body}>
                {safeText(
                  value?.assessment,
                )}
              </Text>

              <Text style={styles.label}>
                Confidence:{" "}
                {safeText(
                  value?.confidence,
                  "0",
                )}
                %
              </Text>
            </View>
          ),
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Bull Case
        </Text>

        <Text style={styles.body}>
          {safeText(
            report.bull_case,
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Bear Case
        </Text>

        <Text style={styles.body}>
          {safeText(
            report.bear_case,
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Key Catalysts
        </Text>

        <List
          items={
            report.key_catalysts
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Key Risks
        </Text>

        <List
          items={
            report.key_risks
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Evidence Used
        </Text>

        <List
          items={
            report.evidence_used
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Final Research View
        </Text>

        <Text style={styles.body}>
          {safeText(
            report.final_view,
          )}
        </Text>
      </View>
    </>
  );
}

function CouncilReport({
  data,
}: {
  data: any;
}) {
  const council =
    data?.council ?? {};

  const consensus =
    council?.consensus ?? {};

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Council Consensus
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>
              Vote
            </Text>

            <Text style={styles.value}>
              {safeText(
                consensus.vote,
              )}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Confidence
            </Text>

            <Text style={styles.value}>
              {safeText(
                consensus.confidence,
                "0",
              )}
              %
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Agreement
            </Text>

            <Text style={styles.value}>
              {safeText(
                consensus.agreement_score,
                "0",
              )}
              %
            </Text>
          </View>
        </View>

        <Text style={styles.body}>
          {safeText(
            consensus.summary,
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Council Members
        </Text>

        {Object.entries(
          council.agents ?? {},
        ).map(
          ([key, agent]: [
            string,
            any,
          ]) => (
            <View
              key={key}
              style={styles.card}
            >
              <Text style={styles.value}>
                {key.toUpperCase()}
              </Text>

              <Text style={styles.label}>
                Vote:{" "}
                {safeText(
                  agent?.vote,
                )}
              </Text>

              <Text style={styles.label}>
                Confidence:{" "}
                {safeText(
                  agent?.confidence,
                  "0",
                )}
                %
              </Text>

              <Text style={styles.body}>
                {safeText(
                  agent?.reason,
                )}
              </Text>
            </View>
          ),
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Dissenting View
        </Text>

        <Text style={styles.body}>
          {safeText(
            consensus.dissenting_view,
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Evidence Strength
        </Text>

        <Text style={styles.body}>
          {safeText(
            council.evidence_strength,
          )}
        </Text>
      </View>
    </>
  );
}

function CompareReport({
  data,
}: {
  data: any;
}) {
  const comparison =
    data?.comparison ?? {};

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Comparison Result
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>
              Winner
            </Text>

            <Text style={styles.value}>
              {safeText(
                comparison.winner,
              )}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Confidence
            </Text>

            <Text style={styles.value}>
              {safeText(
                comparison.comparison_confidence,
                "0",
              )}
              %
            </Text>
          </View>
        </View>

        <Text style={styles.body}>
          {safeText(
            comparison.summary,
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Comparison Categories
        </Text>

        {Object.entries(
          comparison.categories ??
            {},
        ).map(
          ([key, value]: [
            string,
            any,
          ]) => (
            <View
              key={key}
              style={styles.card}
            >
              <Text style={styles.value}>
                {key
                  .replaceAll(
                    "_",
                    " ",
                  )
                  .toUpperCase()}
              </Text>

              <Text style={styles.label}>
                Winner:{" "}
                {safeText(
                  value?.winner,
                )}
              </Text>

              <Text style={styles.body}>
                {safeText(
                  value?.reason,
                )}
              </Text>
            </View>
          ),
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Asset A Case
        </Text>

        <Text style={styles.body}>
          {safeText(
            comparison.asset_a_case,
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Asset B Case
        </Text>

        <Text style={styles.body}>
          {safeText(
            comparison.asset_b_case,
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Key Difference
        </Text>

        <Text style={styles.body}>
          {safeText(
            comparison.key_difference,
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Final Comparative View
        </Text>

        <Text style={styles.body}>
          {safeText(
            comparison.final_view,
          )}
        </Text>
      </View>
    </>
  );
}

export default function ResearchReportPdf({
  report,
}: Props) {
  const data =
    report.result_json ??
    {};

  const reportType =
    report.report_type ??
    "research";

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        <Text style={styles.eyebrow}>
          NESTROVA RESEARCH
        </Text>

        <Text style={styles.title}>
          {report.title ||
            "Research Report"}
        </Text>

        <Text style={styles.subtitle}>
          {report.symbol_a || ""}
          {report.symbol_b
            ? ` vs ${report.symbol_b}`
            : ""}
        </Text>

        {reportType === "deep" && (
          <DeepReport
            data={data}
          />
        )}

        {reportType ===
          "council" && (
          <CouncilReport
            data={data}
          />
        )}

        {reportType ===
          "compare" && (
          <CompareReport
            data={data}
          />
        )}

        <Text style={styles.footer}>
          Nestrova Research provides
          informational research
          intelligence only. It does not
          constitute personalized
          financial, legal, tax, or
          investment advice.
        </Text>
      </Page>
    </Document>
  );
}
