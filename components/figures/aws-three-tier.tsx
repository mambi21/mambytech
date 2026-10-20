import { Arrowhead, Group, Halo, Icon, SecurityGroupBox, Zone, aws, ink, paper, subtle } from "./primitives";
import { Plate, Responsive } from "./plate";

function AwsWide({ marker = "aws-arrow-w" }: { marker?: string }) {
  const a = `url(#${marker})`;
  const zones = [
    { x: 200, label: "Availability Zone 1" },
    { x: 572, label: "Availability Zone 2" },
  ];
  return (
    <svg viewBox="0 0 980 664" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id={marker} color={ink} />
      </defs>
      <Icon name="users" x={50} y={232} size={44} lines={["Users"]} />

      <Group kind="cloud" x={110} y={12} w={860} h={640} label="AWS Cloud" />
      <Group kind="region" x={128} y={50} w={826} h={590} label="Region" />
      <Group kind="vpc" x={150} y={88} w={788} h={536} label="VPC" />

      {zones.map((zone) => (
        <g key={zone.label}>
          <Zone x={zone.x} y={126} w={348} h={484} label={zone.label} />
          <Group kind="public" x={zone.x + 14} y={158} w={320} h={126} label="Public subnet" />
          <Group kind="private" x={zone.x + 14} y={302} w={320} h={150} label="Private subnet" />
          <Group kind="private" x={zone.x + 14} y={470} w={320} h={124} label="Private subnet" />
        </g>
      ))}

      <Group kind="asg" x={226} y={340} w={668} h={104} label="Auto Scaling group" />
      <Group kind="generic" x={222} y={500} w={676} h={84} label="DB subnet group" color={subtle} />

      {/* Request path */}
      <g stroke={ink} strokeWidth="1.4">
        <path d="M76 232H124" markerEnd={a} />
        <path d="M176 232H190V194H560V204" markerEnd={a} />
        <path d="M560 256V272H374V364" markerEnd={a} />
        <path d="M560 272H746V364" markerEnd={a} />
        <path d="M364 440V512" markerEnd={a} />
        <path d="M746 440V461H386V512" markerEnd={a} />
      </g>
      {/* Outbound traffic from private instances */}
      <g stroke={ink} strokeWidth="1.2" strokeDasharray="5 4">
        <path d="M404 392H450V260" markerEnd={a} />
        <path d="M716 392H708V294H450" />
      </g>

      <Icon name="internet-gateway" x={150} y={232} size={44} lines={["Internet", "gateway"]} />
      <SecurityGroupBox x={530} y={202} w={60} h={60} />
      <Icon name="alb" x={560} y={232} size={44} />
      <Halo x={590} y={228} anchor="start" halo={aws.greenFill}>
        Application
      </Halo>
      <Halo x={590} y={243} anchor="start" halo={aws.greenFill}>
        Load Balancer
      </Halo>
      <Icon name="nat-gateway" x={450} y={232} size={44} />
      <Halo x={422} y={236} anchor="end" size={11.5} halo={aws.greenFill}>
        NAT gateway
      </Halo>
      {zones.map((zone) => (
        <g key={`r-${zone.label}`}>
          <SecurityGroupBox x={zone.x + 144} y={362} w={60} h={60} />
          <Icon name="ec2-instance" x={zone.x + 174} y={392} size={44} lines={["EC2 instance"]} labelSize={11.5} halo={aws.tealFill} />
        </g>
      ))}
      <SecurityGroupBox x={334} y={506} w={60} h={60} />
      <Icon name="rds-instance" x={364} y={536} size={44} lines={["Amazon RDS"]} labelSize={11.5} halo={aws.tealFill} />
    </svg>
  );
}

function AwsCompact() {
  const a = "url(#aws-arrow-c)";
  const zones = [
    { x: 40, label: "AZ 1" },
    { x: 204, label: "AZ 2" },
  ];
  return (
    <svg viewBox="0 0 400 724" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="aws-arrow-c" color={ink} />
      </defs>
      <Icon name="users" x={200} y={30} size={36} />
      <Halo x={226} y={34} anchor="start" size={11}>
        Users
      </Halo>

      <Group kind="cloud" x={8} y={74} w={384} h={642} label="AWS Cloud" size={11} icon={20} />
      <Group kind="region" x={18} y={104} w={364} h={602} label="Region" size={11} icon={20} />
      <Group kind="vpc" x={28} y={140} w={344} h={556} label="VPC" size={11} icon={20} />

      {zones.map((zone) => (
        <g key={zone.label}>
          <Zone x={zone.x} y={180} w={156} h={504} label={zone.label} size={11} />
          <Group kind="public" x={zone.x + 6} y={206} w={144} h={160} label="Public" size={10.5} icon={18} />
          <Group kind="private" x={zone.x + 6} y={378} w={144} h={140} label="Private" size={10.5} icon={18} />
          <Group kind="private" x={zone.x + 6} y={530} w={144} h={146} label="Private" size={10.5} icon={18} />
        </g>
      ))}
      <Group kind="asg" x={52} y={404} w={296} h={102} label="Auto Scaling group" size={10.5} icon={18} />
      <Group kind="generic" x={52} y={556} w={296} h={110} label="DB subnet group" size={10.5} color={subtle} />

      <g stroke={ink} strokeWidth="1.3">
        <path d="M200 50V122" markerEnd={a} />
        <path d="M200 162V292" markerEnd={a} />
        <path d="M200 340V372H118V428" markerEnd={a} />
        <path d="M200 372H282V428" markerEnd={a} />
        <path d="M110 486V598" markerEnd={a} />
        <path d="M282 486V522H126V598" markerEnd={a} />
      </g>
      <g stroke={ink} strokeWidth="1.1" strokeDasharray="4 4">
        <path d="M136 452H172V262H137" markerEnd={a} />
        <path d="M300 452H346V236H118V244" markerEnd={a} />
      </g>

      <Icon name="internet-gateway" x={200} y={142} size={34} />
      <Halo x={222} y={146} anchor="start" size={10.5}>
        Internet gateway
      </Halo>
      {zones.map((zone) => (
        <g key={`r-${zone.label}`}>
          <SecurityGroupBox x={zone.x + 58} y={432} w={40} h={40} />
          <Icon name="ec2-instance" x={zone.x + 78} y={452} size={32} lines={["EC2"]} labelSize={10} halo={aws.tealFill} />
        </g>
      ))}
      <Icon name="nat-gateway" x={118} y={262} size={34} lines={["NAT gateway"]} labelSize={10} halo={aws.greenFill} />
      <SecurityGroupBox x={180} y={296} w={40} h={40} />
      <Icon name="alb" x={200} y={316} size={32} />
      <Halo x={200} y={356} size={10}>
        Load Balancer
      </Halo>
      <SecurityGroupBox x={98} y={602} w={40} h={40} />
      <Icon name="rds-instance" x={118} y={622} size={32} lines={["RDS"]} labelSize={10} halo={paper} />
    </svg>
  );
}

export function AwsThreeTierFigure({ number, className }: { number: string; className?: string }) {
  return (
    <Plate
      number={number}
      className={className}
      caption="Two Availability Zones. Solid arrows: request path from the internet gateway through the load balancer and EC2 Auto Scaling group to Amazon RDS. Dashed: outbound traffic through one NAT gateway. Red outlines: security groups. Icons: AWS Architecture Icons."
    >
      <Responsive
        label="AWS architecture diagram. In an AWS Region, a VPC spans two Availability Zones, each with a public subnet, a private application subnet, and a private data subnet. Users reach an internet gateway, then an Application Load Balancer across the public subnets, which forwards to EC2 instances in an Auto Scaling group across the private application subnets. The instances connect to an Amazon RDS database in a DB subnet group across the private data subnets, and reach the internet outbound through a single NAT gateway in the first zone’s public subnet. Security groups surround the load balancer, the instances, and the database."
        wide={<AwsWide />}
        full={<AwsWide marker="aws-arrow-w-full" />}
        compact={<AwsCompact />}
      />
    </Plate>
  );
}
