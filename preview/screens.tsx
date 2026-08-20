/**
 * Preview screens.
 *
 * Real Ant Design components rendered through the package, with realistic
 * BeastMode content — the point is to judge the look before any app is
 * migrated, so a mockup would be worse than useless.
 */

import * as React from "react";
import {
  Layout,
  Menu,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Alert,
  Tabs,
  Card,
  Statistic,
  Badge,
  Progress,
  Switch,
  Segmented,
  Pagination,
  Space,
  Divider,
  Typography,
  Avatar,
  Breadcrumb,
  Steps,
  Checkbox,
  Radio,
  Slider,
  Empty,
} from "antd";
import { BeastModeRoot, Surface } from "../src/index.js";
import { surfaces, chartSeries, status } from "../src/tokens/index.js";
import type { ColorMode } from "../src/tokens/surfaces.js";

const { Header, Sider, Content } = Layout;
const { Title, Text, Link: TLink } = Typography;

const quotes = [
  { key: 1, ref: "Q-4821", club: "Riccarton Rugby Club", items: 48, value: "3,842.00", status: "sent" },
  { key: 2, ref: "Q-4820", club: "Hornby Netball", items: 22, value: "1,196.50", status: "accepted" },
  { key: 3, ref: "Q-4819", club: "Papanui Dodgeball", items: 14, value: "742.00", status: "draft" },
  { key: 4, ref: "Q-4818", club: "St Andrew's College 1st XI", items: 30, value: "2,410.00", status: "overdue" },
  { key: 5, ref: "Q-4817", club: "Selwyn Bulls Touch", items: 64, value: "5,088.00", status: "accepted" },
];

const statusTag: Record<string, { color: string; label: string }> = {
  sent: { color: "processing", label: "Sent" },
  accepted: { color: "success", label: "Accepted" },
  draft: { color: "default", label: "Draft" },
  overdue: { color: "error", label: "Overdue" },
};

const columns = [
  {
    title: "Reference",
    dataIndex: "ref",
    render: (v: string) => <span className="bm-mono">{v}</span>,
  },
  { title: "Club", dataIndex: "club" },
  { title: "Items", dataIndex: "items", align: "right" as const, className: "bm-tabular" },
  {
    title: "Value (NZD)",
    dataIndex: "value",
    align: "right" as const,
    render: (v: string) => <span className="bm-tabular">${v}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (v: string) => <Tag color={statusTag[v]!.color}>{statusTag[v]!.label}</Tag>,
  },
];

/** A bm-sales-shaped staff screen: sidebar, dense table, stat tiles. */
function StaffScreen({ mode }: { mode: ColorMode }) {
  const s = surfaces[mode];
  return (
    <Layout style={{ minHeight: 620, background: s.page }}>
      <Sider width={210} theme={mode === "dark" ? "dark" : "light"}>
        <div style={{ padding: "18px 20px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: "#bf272d",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "var(--bm-font-heading)",
            }}
          >
            B
          </div>
          <span style={{ fontFamily: "var(--bm-font-heading)", fontWeight: 700, letterSpacing: "-0.01em" }}>
            SalesFlow
          </span>
        </div>
        <Menu
          mode="inline"
          theme={mode === "dark" ? "dark" : "light"}
          selectedKeys={["quotes"]}
          items={[
            { key: "dash", label: "Dashboard" },
            { key: "quotes", label: "Quotes" },
            { key: "orders", label: "Orders" },
            { key: "customers", label: "Customers" },
            { key: "products", label: "Products" },
            { key: "messages", label: <Badge count={3} offset={[10, 0]}>Messages</Badge> },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: 22 }}>
          <Breadcrumb items={[{ title: <TLink>Sales</TLink> }, { title: "Quotes" }]} />
          <Space size={12}>
            <Switch defaultChecked size="small" />
            <Avatar size={30} style={{ background: "#4f46e5" }}>DB</Avatar>
          </Space>
        </Header>
        <Content style={{ padding: 22, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>Quotes</h3>
              <Text type="secondary">48 open across 31 clubs</Text>
            </div>
            <Space>
              <Button>Export</Button>
              <Button type="primary">New quote</Button>
            </Space>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <Card size="small"><Statistic title="Quoted this month" value={48210} prefix="$" /></Card>
            <Card size="small"><Statistic title="Accepted" value={31} suffix="/ 48" /></Card>
            <Card size="small"><Statistic title="Conversion" value={64.6} suffix="%" valueStyle={{ color: mode === "dark" ? "#73d13d" : "#357000" }} /></Card>
            <Card size="small"><Statistic title="Avg. lead time" value={4.6} suffix="wk" /></Card>
          </div>

          <Alert
            type="warning"
            showIcon
            message="Two quotes are past their follow-up date"
            description="Q-4818 and Q-4814 were sent more than 14 days ago with no response."
          />

          <Card
            size="small"
            title="Open quotes"
            extra={
              <Space>
                <Input placeholder="Search club or reference" style={{ width: 230 }} />
                <Select
                  defaultValue="all"
                  style={{ width: 140 }}
                  options={[
                    { value: "all", label: "All statuses" },
                    { value: "sent", label: "Sent" },
                    { value: "accepted", label: "Accepted" },
                  ]}
                />
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={quotes}
              pagination={false}
              size="small"
              rowSelection={{ selectedRowKeys: [2] }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 14 }}>
              <Pagination current={1} total={48} pageSize={5} size="small" />
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

/** A customer-facing screen: brand red, Montserrat body, Archivo headings. */
function CustomerScreen({ brand }: { brand: "estore" | "gotyaback" }) {
  return (
    <Surface kind="customer" brand={brand} mode="light">
      <div style={{ padding: "34px 40px", minHeight: 620 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <div className="bm-overline" style={{ color: "var(--bm-accent)" }}>Order confirmed</div>
            <h1 style={{ margin: "6px 0 0" }}>Thanks, Riccarton Rugby Club</h1>
            <p style={{ color: "var(--bm-text-secondary)", margin: "8px 0 0" }}>
              Your order is in production. We will email tracking as soon as it ships.
            </p>
          </div>

          <Steps
            current={1}
            size="small"
            items={[{ title: "Confirmed" }, { title: "In production" }, { title: "Shipped" }, { title: "Delivered" }]}
          />

          <Card title="Order BM-10482" extra={<Tag color="success">Paid</Tag>}>
            <Table
              size="small"
              pagination={false}
              columns={[
                { title: "Item", dataIndex: "item" },
                { title: "Size", dataIndex: "size" },
                { title: "Qty", dataIndex: "qty", align: "right", className: "bm-tabular" },
                { title: "Total", dataIndex: "total", align: "right", className: "bm-tabular" },
              ]}
              dataSource={[
                { key: 1, item: "Sublimated playing singlet", size: "Mixed", qty: 30, total: "$1,890.00" },
                { key: 2, item: "Training tee", size: "Mixed", qty: 30, total: "$1,140.00" },
                { key: 3, item: "Embroidered cap", size: "OSFA", qty: 18, total: "$486.00" },
              ]}
            />
            <Divider style={{ margin: "14px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Text type="secondary">Total including GST</Text>
              <span className="bm-tabular" style={{ fontFamily: "var(--bm-font-heading)", fontSize: 26, fontWeight: 700 }}>
                $3,516.00
              </span>
            </div>
          </Card>

          <Card size="small" title="Delivery address">
            <Space direction="vertical" size={4}>
              <Text>Riccarton Rugby Club</Text>
              <Text type="secondary">12 Kilmarnock Street, Riccarton, Christchurch 8041</Text>
            </Space>
          </Card>

          {/*
            The danger protocol in practice: the affirmative action is the only
            solid fill. The destructive one is outlined, so the two never read
            as the same control even though both are red.
          */}
          <Space>
            <Button type="primary" size="large">Track this order</Button>
            <Button size="large">Download invoice</Button>
            <Button danger size="large">Cancel order</Button>
          </Space>
        </div>
      </div>
    </Surface>
  );
}

function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 104 }}>
      <div style={{ height: 52, borderRadius: 6, background: hex, border: "1px solid rgba(128,128,128,.25)" }} />
      <div style={{ fontSize: 12, lineHeight: 1.35 }}>
        <div className="bm-mono" style={{ fontWeight: 600 }}>{hex}</div>
        <div style={{ color: "var(--bm-text-secondary)" }}>{label}</div>
      </div>
    </div>
  );
}

/** Components and palettes, so individual pieces can be judged up close. */
function Gallery({ mode }: { mode: ColorMode }) {
  const s = surfaces[mode];
  const st = status[mode];
  return (
    <div style={{ padding: 26, background: s.page, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <Card size="small" title="Buttons">
          <Space wrap>
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="text">Text</Button>
            <Button type="link">Link</Button>
            <Button danger>Danger</Button>
            <Button type="primary" disabled>Disabled</Button>
          </Space>
        </Card>

        <Card size="small" title="Form controls">
          <Space direction="vertical" style={{ width: "100%" }} size={10}>
            <Input placeholder="Club name" />
            <Select
              style={{ width: "100%" }}
              defaultValue="singlet"
              options={[
                { value: "singlet", label: "Sublimated singlet" },
                { value: "tee", label: "Training tee" },
              ]}
            />
            <Space>
              <Checkbox defaultChecked>Rush order</Checkbox>
              <Radio defaultChecked>Standard</Radio>
              <Switch defaultChecked />
            </Space>
            <Slider defaultValue={62} />
          </Space>
        </Card>

        <Card size="small" title="Status">
          <Space direction="vertical" style={{ width: "100%" }} size={10}>
            <Space wrap>
              <Tag color="success">Accepted</Tag>
              <Tag color="processing">Sent</Tag>
              <Tag color="warning">Pending</Tag>
              <Tag color="error">Overdue</Tag>
              <Tag>Draft</Tag>
            </Space>
            <Alert type="success" showIcon message="Payment received" />
            <Alert type="info" showIcon message="Artwork is with the designer" />
            <Alert type="error" showIcon message="Card declined" />
          </Space>
        </Card>

        <Card size="small" title="Navigation and progress">
          <Space direction="vertical" style={{ width: "100%" }} size={12}>
            <Tabs
              size="small"
              defaultActiveKey="1"
              items={[
                { key: "1", label: "Details" },
                { key: "2", label: "Items" },
                { key: "3", label: "History" },
              ]}
            />
            <Segmented options={["Light", "Dark", "System"]} defaultValue="Dark" />
            <Progress percent={64} />
          </Space>
        </Card>
      </div>

      <Card size="small" title="Surface ramp">
        <Space wrap size={12}>
          <Swatch hex={s.chrome} label="chrome" />
          <Swatch hex={s.page} label="page" />
          <Swatch hex={s.panel} label="panel" />
          <Swatch hex={s.elevated} label="elevated" />
          <Swatch hex={s.subtle} label="subtle" />
        </Space>
      </Card>

      <Card size="small" title="Status colours">
        <Space wrap size={12}>
          <Swatch hex={st.success.base} label="success" />
          <Swatch hex={st.warning.base} label="warning" />
          <Swatch hex={st.error.base} label="error" />
          <Swatch hex={st.info.base} label="info (indigo)" />
        </Space>
      </Card>

      <Card size="small" title="Chart series">
        <Space wrap size={12}>
          {chartSeries[mode].map((c, i) => (
            <Swatch key={c} hex={c} label={`series ${i + 1}`} />
          ))}
        </Space>
      </Card>

      <Card size="small" title="Empty state">
        <Empty description="No quotes match those filters" />
      </Card>
    </div>
  );
}

export function StaffLight() {
  return (
    <BeastModeRoot mode="light">
      <StaffScreen mode="light" />
      <Gallery mode="light" />
    </BeastModeRoot>
  );
}

export function StaffDark() {
  return (
    <BeastModeRoot mode="dark">
      <StaffScreen mode="dark" />
      <Gallery mode="dark" />
    </BeastModeRoot>
  );
}

export function CustomerEstore() {
  return (
    <BeastModeRoot mode="light">
      <CustomerScreen brand="estore" />
    </BeastModeRoot>
  );
}

export function CustomerGotyaback() {
  return (
    <BeastModeRoot mode="light">
      <CustomerScreen brand="gotyaback" />
    </BeastModeRoot>
  );
}
