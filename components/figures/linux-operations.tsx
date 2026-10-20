import { Arrowhead, Group, Halo, Icon, ink, subtle, white } from "./primitives";
import { Plate, Responsive } from "./plate";

const lanes: Array<{ name: string; detail: string; icon: string | null }> = [
  { name: "Administer", detail: "users · services · storage", icon: null },
  { name: "Patch", detail: "OS updates", icon: "shield" },
  { name: "Configure", detail: "managed configuration", icon: "gear" },
  { name: "Troubleshoot", detail: "logs · diagnosis", icon: "document" },
];

function LinuxWide({ marker = "linux-arrow-w" }: { marker?: string }) {
  const a = `url(#${marker})`;
  const ys = [96, 188, 280, 372];
  return (
    <svg viewBox="0 0 960 452" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id={marker} color={ink} />
      </defs>
      <Halo x={80} y={190}>
        Admin workstation
      </Halo>
      <Icon name="client" x={80} y={232} size={52} />

      <Group kind="generic" x={700} y={36} w={236} h={392} label="Linux hosts" color={subtle} />
      {[124, 232, 340].map((y, i) => (
        <Icon key={y} name="servers" x={818} y={y} size={52} lines={[`host-0${i + 1}`]} labelSize={11} />
      ))}

      <g stroke={ink} strokeWidth="1.4">
        <path d="M108 232H180V96H690" markerEnd={a} />
        <path d="M180 188H370" />
        <path d="M430 188H690" markerEnd={a} />
        <path d="M180 232V280H370" />
        <path d="M430 280H690" markerEnd={a} />
      </g>
      <g stroke={ink} strokeWidth="1.4" strokeDasharray="5 4">
        <path d="M690 372H432" markerEnd={a} />
        <path d="M368 372H80V266" markerEnd={a} />
      </g>

      {lanes.map((lane, i) => (
        <g key={lane.name}>
          {lane.icon ? <Icon name={lane.icon} x={400} y={ys[i]} size={44} /> : null}
          <Halo x={456} y={ys[i] - 26} anchor="start" size={15}>
            {`0${i + 1}  ${lane.name}`}
          </Halo>
          <Halo x={456} y={ys[i] - 10} anchor="start" size={10.5} weight={400} fill={subtle} mono>
            {lane.detail.toUpperCase()}
          </Halo>
        </g>
      ))}
    </svg>
  );
}

function LinuxCompact() {
  const a = "url(#linux-arrow-c)";
  const ys = [170, 262, 354, 446];
  return (
    <svg viewBox="0 0 400 712" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="linux-arrow-c" color={ink} />
      </defs>
      <Icon name="client" x={200} y={44} size={48} lines={["Admin workstation"]} />

      <g stroke={ink} strokeWidth="1.3">
        <path d="M228 44H372V528" markerEnd={a} />
      </g>
      <g stroke={ink} strokeWidth="1.3" strokeDasharray="5 4">
        <path d="M44 600H22V44H172" markerEnd={a} />
      </g>

      {lanes.map((lane, i) => (
        <g key={lane.name}>
          {lane.icon ? (
            <Icon name={lane.icon} x={74} y={ys[i]} size={40} />
          ) : (
            <g>
              <circle cx="74" cy={ys[i]} r="18" fill={white} stroke={ink} strokeWidth="1.25" />
              <path d={`M64 ${ys[i]}h20M74 ${ys[i] - 10}v20`} stroke={ink} strokeWidth="1.25" />
            </g>
          )}
          <Halo x={108} y={ys[i] - 2} anchor="start" size={16}>
            {`0${i + 1}  ${lane.name}`}
          </Halo>
          <Halo x={108} y={ys[i] + 16} anchor="start" size={10} weight={400} fill={subtle} mono>
            {lane.detail.toUpperCase()}
          </Halo>
        </g>
      ))}

      <Group kind="generic" x={44} y={540} w={312} h={156} label="Linux hosts" color={subtle} />
      {[110, 200, 290].map((x, i) => (
        <Icon key={x} name="servers" x={x} y={616} size={44} lines={[`host-0${i + 1}`]} labelSize={10.5} />
      ))}
    </svg>
  );
}

export function LinuxOperationsFigure({ number, className }: { number: string; className?: string }) {
  return (
    <Plate
      number={number}
      className={className}
      caption="Scope of the operations work: from an admin workstation, the Linux hosts are administered, patched, and configured; logs and diagnostics come back for troubleshooting (dashed). Icons: AWS Architecture Icons (general)."
    >
      <Responsive
        label="Operations diagram. An admin workstation connects to a group of three Linux hosts through four lanes: administer (users, services, storage), patch (OS updates), and configure (managed configuration) go to the hosts; troubleshoot (logs and diagnosis) returns from the hosts to the workstation."
        wide={<LinuxWide />}
        full={<LinuxWide marker="linux-arrow-w-full" />}
        compact={<LinuxCompact />}
      />
    </Plate>
  );
}
