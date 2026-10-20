import { Arrowhead, Badge, Box, Halo, Icon, Note, Tile, ink } from "./primitives";
import { Plate, Responsive } from "./plate";

function PipelineWide({ marker = "cicd-arrow-w" }: { marker?: string }) {
  const a = `url(#${marker})`;
  return (
    <svg viewBox="0 0 1240 800" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id={marker} color={ink} />
      </defs>

      {/* Lanes */}
      <Box x={264} y={40} w={956} h={210} label="Continuous integration · Jenkins" logo="jenkins" />
      <Box x={264} y={290} w={956} h={262} label="Continuous delivery · GitOps" logo="argo" />
      <Box x={545} y={330} w={230} h={160} label="Staging" />
      <Box x={1030} y={330} w={180} h={160} label="Production" />
      <Box x={960} y={600} w={260} h={170} label="Monitoring" />
      <Box x={20} y={600} w={900} h={180} label="Infrastructure pipeline · Terraform" logo="terraform" />

      {/* Main path */}
      <g stroke={ink} strokeWidth="1.4">
        <path d="M84 130H148" markerEnd={a} />
        <path d="M208 130H298" markerEnd={a} />
        <path d="M358 130H438" markerEnd={a} />
        <path d="M498 130H578" markerEnd={a} />
        <path d="M638 130H718" markerEnd={a} />
        <path d="M778 130H858" markerEnd={a} />
        <path d="M918 130H1008" markerEnd={a} />
        <path d="M1040 200V262H290V410H300" markerEnd={a} />
        <path d="M358 410H438" markerEnd={a} />
        <path d="M498 410H541" markerEnd={a} />
        <path d="M775 410H815" markerEnd={a} />
        <path d="M875 410H939" markerEnd={a} />
        <path d="M991 410H1026" markerEnd={a} />
        <path d="M1066 674H1140" markerEnd={a} />
        <path d="M138 674H240" markerEnd={a} />
        <path d="M300 674H400" markerEnd={a} />
        <path d="M430 646V558" markerEnd={a} />
      </g>
      <g stroke={ink} strokeWidth="1.2" strokeDasharray="5 4">
        <path d="M470 102V64H180V100" markerEnd={a} />
        <path d="M1050 494V646" markerEnd={a} />
        <path d="M1170 646V496" markerEnd={a} />
        <path d="M460 674H574" markerEnd={a} />
      </g>

      {/* CI */}
      <Icon name="client" x={56} y={130} size={48} lines={["Developer"]} />
      <Note x={56} y={186} anchor="middle">
        push · PR
      </Note>
      <Tile logo="github" x={180} y={130} lines={["GitHub"]} />
      <Tile logo="jenkins" x={330} y={130} lines={["Build & unit test"]} sub="Jenkins" />
      <Tile logo="sonarqubeserver" x={470} y={130} lines={["Quality gate"]} sub="SonarQube" />
      <Tile logo="sonatype" x={610} y={130} lines={["Publish artifact"]} sub="Nexus" />
      <Tile logo="docker" x={750} y={130} lines={["Build image"]} sub="Docker" />
      <Tile logo="trivy" x={890} y={130} lines={["Image scan"]} sub="Trivy" />
      <Note x={890} y={206} anchor="middle" size={9.5}>
        critical CVEs block it
      </Note>
      <Icon name="ecr" x={1040} y={130} size={52} lines={["Amazon ECR"]} />
      <Note x={234} y={120} anchor="middle">
        webhook
      </Note>
      <Note x={480} y={60}>
        gate fails → build stops, status to GitHub
      </Note>
      <Note x={282} y={236}>
        PRs run steps 2–3 · main runs everything · one build, tagged with the commit SHA
      </Note>

      {/* CD */}
      <Note x={346} y={282}>
        Jenkins commits the new image tag
      </Note>
      <Tile logo="helm" x={330} y={410} lines={["GitOps repo"]} sub="Helm chart + values" labelSize={11.5} />
      <Tile logo="argo" x={470} y={410} lines={["Argo CD"]} sub="auto-sync" labelSize={11.5} />
      <Icon name="eks" x={605} y={410} size={44} lines={["EKS"]} labelSize={11.5} />
      <Icon name="ec2" x={715} y={410} size={44} lines={["EC2"]} labelSize={11.5} />
      <Tile logo="jenkins" x={845} y={410} lines={["Smoke &", "integration tests"]} labelSize={11.5} />
      <Icon name="users" x={965} y={410} size={44} lines={["Approval"]} labelSize={11.5} />
      <Note x={965} y={466} anchor="middle" size={9.5}>
        PR to prod values
      </Note>
      <Icon name="eks" x={1075} y={410} size={40} lines={["EKS"]} labelSize={11.5} />
      <Icon name="ec2" x={1165} y={410} size={40} lines={["EC2"]} labelSize={11.5} />
      <Note x={1120} y={478} anchor="middle" size={9.5}>
        Argo CD sync · rolling
      </Note>
      <Icon name="iam" x={286} y={526} size={26} />
      <Note x={306} y={530}>
        EC2 hosts get the Nexus artifact from Jenkins · IAM roles, no stored keys
      </Note>

      {/* Monitoring */}
      <Tile logo="prometheus" x={1040} y={674} lines={["Prometheus"]} labelSize={11.5} />
      <Tile logo="grafana" x={1170} y={674} lines={["Grafana"]} labelSize={11.5} />
      <Note x={1040} y={580} anchor="end">
        metrics
      </Note>
      <Note x={1180} y={580}>
        rollback
      </Note>

      {/* Infrastructure */}
      <Tile logo="terraform" x={110} y={674} lines={["Plan"]} sub="on pull request" labelSize={11.5} />
      <Icon name="users" x={270} y={674} size={44} lines={["Approval"]} labelSize={11.5} />
      <Tile logo="terraform" x={430} y={674} lines={["Apply"]} labelSize={11.5} />
      <Icon name="s3" x={606} y={674} size={44} lines={["Remote state"]} labelSize={11.5} />
      <Note x={606} y={734} anchor="middle" size={9.5}>
        Amazon S3
      </Note>
      <Note x={442} y={610}>
        provisions staging & production
      </Note>

      <Badge x={116} y={112} n={1} />
      <Badge x={244} y={98} n={2} />
      <Badge x={408} y={112} n={3} />
      <Badge x={548} y={112} n={4} />
      <Badge x={688} y={112} n={5} />
      <Badge x={828} y={112} n={6} />
      <Badge x={968} y={112} n={7} />
      <Badge x={720} y={262} n={8} />
      <Badge x={408} y={392} n={9} />
      <Badge x={520} y={392} n={10} />
      <Badge x={795} y={392} n={11} />
      <Badge x={907} y={392} n={12} />
      <Badge x={1008} y={392} n={13} />
      <Badge x={1050} y={548} n={14} />
    </svg>
  );
}

function PipelineCompact() {
  const a = "url(#cicd-arrow-c)";
  const ci = [
    { logo: "jenkins", name: "Build & unit test", tool: "Jenkins", y: 176 },
    { logo: "sonarqubeserver", name: "Quality gate", tool: "SonarQube", y: 274 },
    { logo: "sonatype", name: "Publish artifact", tool: "Nexus", y: 372 },
    { logo: "docker", name: "Build image", tool: "Docker", y: 470 },
    { logo: "trivy", name: "Image scan", tool: "Trivy · critical CVEs block it", y: 568 },
  ];
  const cd = [
    { logo: "helm", name: "GitOps repo", tool: "Helm chart + values", y: 966, n: 9 },
    { logo: "argo", name: "Argo CD", tool: "auto-sync from Git", y: 1064, n: 10 },
  ];
  return (
    <svg viewBox="0 0 400 2090" className="block h-auto w-full" fill="none">
      <defs>
        <Arrowhead id="cicd-arrow-c" color={ink} />
      </defs>

      <Box x={16} y={108} w={368} h={752} label="Continuous integration" logo="jenkins" />
      <Box x={16} y={890} w={368} h={740} label="Continuous delivery · GitOps" logo="argo" />
      <Box x={32} y={1114} w={336} h={120} label="Staging" />
      <Box x={32} y={1438} w={336} h={120} label="Production" />
      <Box x={16} y={1664} w={368} h={124} label="Monitoring" />
      <Box x={16} y={1820} w={368} h={256} label="Infrastructure · Terraform" logo="terraform" />

      <g stroke={ink} strokeWidth="1.3">
        <path d="M138 44H252" markerEnd={a} />
        <path d="M290 70V140H110V146" markerEnd={a} />
        {ci.map((stage, i) => (
          <path key={stage.y} d={`M110 ${stage.y + 26}V${(ci[i + 1]?.y ?? 666) - 30}`} markerEnd={a} />
        ))}
        <path d="M110 694V880H110V936" markerEnd={a} />
        <path d="M110 992V1034" markerEnd={a} />
        <path d="M110 1090V1110" markerEnd={a} />
        <path d="M200 1234V1252H110V1270" markerEnd={a} />
        <path d="M110 1326V1360" markerEnd={a} />
        <path d="M110 1404V1420H200V1434" markerEnd={a} />
        <path d="M144 1726H256" markerEnd={a} />
        <path d="M110 1900H170" markerEnd={a} />
        <path d="M230 1900H290" markerEnd={a} />
      </g>
      <g stroke={ink} strokeWidth="1.1" strokeDasharray="4 4">
        <path d="M84 274H28V44H84" markerEnd={a} />
        <path d="M140 1558V1696" markerEnd={a} />
        <path d="M284 1696V1562" markerEnd={a} />
        <path d="M320 1930V1970H230" markerEnd={a} />
        <path d="M392 1860V1170H372" markerEnd={a} />
      </g>

      <Icon name="client" x={110} y={44} size={40} />
      <Halo x={110} y={86} size={11}>
        Developer
      </Halo>
      <Tile logo="github" x={290} y={44} size={48} />
      <Halo x={290} y={86} size={11}>
        GitHub
      </Halo>

      {ci.map((stage, i) => (
        <g key={stage.name}>
          <Tile logo={stage.logo} x={110} y={stage.y} size={52} />
          <Halo x={152} y={stage.y - 2} anchor="start" size={15}>
            {`0${i + 2}  ${stage.name}`}
          </Halo>
          <Note x={152} y={stage.y + 15} size={9.5}>
            {stage.tool}
          </Note>
        </g>
      ))}
      <Icon name="ecr" x={110} y={666} size={48} />
      <Halo x={152} y={664} anchor="start" size={15}>
        07  Push image
      </Halo>
      <Note x={152} y={681} size={9.5}>
        Amazon ECR
      </Note>
      <Note x={36} y={262} size={9}>
        fail
      </Note>
      <Note x={32} y={736} size={9}>
        one build · tagged with the commit SHA
      </Note>
      <Note x={122} y={830} size={9}>
        08 Jenkins commits the image tag
      </Note>

      {cd.map((stage) => (
        <g key={stage.name}>
          <Tile logo={stage.logo} x={110} y={stage.y} size={52} />
          <Halo x={152} y={stage.y - 2} anchor="start" size={15}>
            {`${stage.n < 10 ? "0" : ""}${stage.n}  ${stage.name}`}
          </Halo>
          <Note x={152} y={stage.y + 15} size={9.5}>
            {stage.tool}
          </Note>
        </g>
      ))}
      <Icon name="eks" x={140} y={1176} size={36} lines={["EKS"]} labelSize={10.5} />
      <Icon name="ec2" x={260} y={1176} size={36} lines={["EC2"]} labelSize={10.5} />
      <Tile logo="jenkins" x={110} y={1298} size={48} />
      <Halo x={150} y={1296} anchor="start" size={15}>
        11  Smoke tests
      </Halo>
      <Note x={150} y={1312} size={9.5}>
        integration checks
      </Note>
      <Icon name="users" x={110} y={1384} size={40} />
      <Halo x={150} y={1382} anchor="start" size={15}>
        12  Approval
      </Halo>
      <Note x={150} y={1398} size={9.5}>
        PR to prod values
      </Note>
      <Icon name="eks" x={140} y={1500} size={36} lines={["EKS"]} labelSize={10.5} />
      <Icon name="ec2" x={260} y={1500} size={36} lines={["EC2"]} labelSize={10.5} />
      <Note x={200} y={1584} anchor="middle" size={9.5}>
        13 Argo CD sync · rolling
      </Note>
      <Icon name="iam" x={44} y={1608} size={20} />
      <Note x={60} y={1612} size={8.5}>
        EC2 gets the Nexus artifact · IAM roles, no keys
      </Note>

      <Tile logo="prometheus" x={116} y={1726} size={44} lines={["Prometheus"]} labelSize={10.5} />
      <Tile logo="grafana" x={284} y={1726} size={44} lines={["Grafana"]} labelSize={10.5} />
      <Note x={150} y={1652} size={9}>
        14 metrics
      </Note>
      <Note x={276} y={1652} anchor="end" size={9}>
        rollback
      </Note>

      <Tile logo="terraform" x={80} y={1900} size={48} lines={["Plan"]} labelSize={10.5} />
      <Icon name="users" x={200} y={1900} size={40} lines={["Approval"]} labelSize={10.5} />
      <Tile logo="terraform" x={320} y={1900} size={48} lines={["Apply"]} labelSize={10.5} />
      <Icon name="s3" x={200} y={1990} size={40} lines={["Remote state · S3"]} labelSize={10.5} />
      <Note x={372} y={1840} anchor="end" size={9}>
        provisions environments ↑
      </Note>
    </svg>
  );
}

export function PipelineFigure({ number, className }: { number: string; className?: string }) {
  return (
    <Plate
      number={number}
      className={className}
      caption="CI in Jenkins, GitOps delivery to Amazon EKS with Argo CD and Helm, monitoring with rollback, and a separate Terraform pipeline. Logos: Simple Icons; AWS icons: AWS Architecture Icons."
      steps={{
        title: "Pipeline steps",
        items: [
          "A push or pull request reaches GitHub.",
          "The GitHub webhook starts the Jenkins build and unit tests.",
          "SonarQube runs the quality gate and reports failures back to GitHub.",
          "The versioned artifact is published to Nexus.",
          "Docker builds the image.",
          "Trivy scans the image; critical vulnerabilities stop the release.",
          "The image is pushed to Amazon ECR. Pull requests stop after the quality gate.",
          "Jenkins commits the new image tag to the Helm values in the GitOps repo.",
          "Argo CD syncs the change.",
          "The release reaches staging on Amazon EKS; EC2 hosts receive the Nexus artifact.",
          "Smoke and integration tests run against staging.",
          "An approved pull request promotes the same tag to the production values.",
          "Argo CD rolls it out to production.",
          "Prometheus and Grafana watch production; failed health checks roll back to the previous revision.",
        ],
      }}
    >
      <Responsive
        label="CI/CD pipeline with GitOps. Continuous integration in Jenkins: a developer's push or pull request reaches GitHub, whose webhook starts the build and unit tests; a SonarQube quality gate reports failures back to GitHub; the versioned artifact is published to Nexus; a Docker image is built, scanned with Trivy (critical vulnerabilities stop it), and pushed to Amazon ECR. Pull requests stop after the quality gate. Continuous delivery: Jenkins commits the new image tag to Helm values in a GitOps repository; Argo CD syncs it to staging on Amazon EKS; smoke and integration tests run; an approved pull request promotes the same tag to production values, and Argo CD rolls it out to production. EC2 hosts receive the Nexus artifact from Jenkins, which uses IAM roles rather than stored keys. Prometheus and Grafana watch production, and failed health triggers a rollback. A separate Terraform pipeline plans on pull request, waits for approval, and applies, keeping remote state in Amazon S3; it provisions staging and production."
        wide={<PipelineWide />}
        full={<PipelineWide marker="cicd-arrow-w-full" />}
        compact={<PipelineCompact />}
      />
    </Plate>
  );
}
