/**
 * Networking Fundamentals — How Networks Work — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in networking_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Networks & the Big Picture ──────────────────────────────────────
  {
    week: 1,
    title: 'Networks & the Big Picture',
    description: 'What a network is, the hardware behind it, and the layered model that makes it all fit together.',
    topics: [
      {
        title: 'What Is a Network?',
        text: 'A network is two or more devices that can exchange data. The internet is a network of networks — thousands of interconnected networks cooperating through open standards.\n\nEvery exchange has the same shape: a sender, a receiver, a medium (copper, fibre, radio), and a protocol — the agreed rules for how messages are formatted and interpreted.\n\nWhy learn networking: every app you build, every device you support, and every cloud service you use sits on this foundation. Connectivity problems are the most common IT issues, and they all trace back to these basics.',
        code: '// The anatomy of every exchange\nSender ──medium─── Receiver\n   │                   │\n   └── protocol ──────┘  (rules both sides agree on)\n\n// Networks by size\nLAN  → one building (your home, an office)\nWAN  → connects LANs across cities\nISP  → the company that gives you internet access',
        note: 'Protocols are the invisible contract. HTTP, TCP, IP and DNS are all examples you use daily.',
      },
      {
        title: 'Network Hardware: NICs, Switches, Routers',
        text: 'The NIC (network interface card) gives a device its address on the network. A switch connects devices within the same network (LAN) and forwards frames to the right device. A router connects different networks and forwards packets between them — your home router connects your LAN to the ISP.\n\nThink of it this way: switches work inside a network, routers work between networks. An access point (AP) adds Wi-Fi to a wired network.\n\nThe home router is actually several devices in one box: router, switch, access point, DHCP server, and often a firewall.',
        code: '// Small LAN\nPC ──┐\nPC ──┤── Switch ── Router ── ISP ── Internet\nPC ──┘\n\n// What your home router really is\nRouter (between networks)\n  + Switch (devices in the LAN)\n  + Access point (Wi-Fi)\n  + DHCP server (assigns IPs)\n  + Firewall (filters traffic)',
        note: 'Remember: switch = inside one network, router = between networks. It clears up most confusion.',
      },
      {
        title: 'Clients, Servers & Peer-to-Peer',
        text: 'In the client-server model, a server offers a service (a website, email, a game) and clients request it. Servers have fixed addresses so clients can always find them.\n\nThe web works this way: your browser (client) requests a page from a web server. Email, streaming, and most apps follow the same shape.\n\nPeer-to-peer (P2P) flips it: every participant is both client and server — BitTorrent and some messaging apps work this way. Most of what you\'ll support is client-server, so master that model first.',
        code: '// Client-Server\nClient ──request──▶ Server (fixed address)\nClient ──request──▶ Server\n\n// Peer-to-Peer\nPeer ◀───▶ Peer     every node is client + server\nPeer ◀───▶ Peer',
        note: 'Servers are just computers running services with stable addresses. No magic.',
      },
      {
        title: 'The OSI Model & TCP/IP — Layers of Abstraction',
        text: 'Networking is too complex for one protocol, so it is split into layers. The OSI model (7 layers) is the textbook map; the TCP/IP model (4 layers) is what the internet actually uses.\n\nTCP/IP: Application (HTTP, DNS — your data), Transport (TCP/UDP — reliable delivery and ports), Internet (IP — addressing and routing), Link (Ethernet/Wi-Fi — physical transport).\n\nWhy layers matter: each layer talks to its peer on the other device using its protocol, but only relies on the layer below. You can change Wi-Fi for fibre at the link layer and HTTP still works unchanged.',
        code: '// TCP/IP model (what the internet uses)\n4  Application   HTTP, DNS, SMTP   "what the data means"\n3  Transport     TCP, UDP          "reliable? which port?"\n2  Internet      IP, ICMP          "who is it for? route it"\n1  Link          Ethernet, Wi-Fi   "put it on the wire"\n\n// A web request travels down the layers,\n// across the wire, and up the other side.',
        note: 'Layers let each level change independently. That is the entire reason the internet evolved so fast.',
      },
    ],
    quizzes: [
      { text: 'A network is…', options: ['two or more devices that can exchange data', 'a single computer', 'a web page', 'a CPU'], correctAnswer: 'two or more devices that can exchange data' },
      { text: 'A switch connects devices…', options: ['within the same network (LAN)', 'between different networks', 'to the internet only', 'to printers only'], correctAnswer: 'within the same network (LAN)' },
      { text: 'In the client-server model, a server…', options: ['offers a service clients request', 'has no address', 'only downloads files', 'is a browser'], correctAnswer: 'offers a service clients request' },
      { text: 'The model the internet actually uses is…', options: ['TCP/IP (4 layers)', 'OSI (7 layers)', 'UDP only', 'one giant protocol'], correctAnswer: 'TCP/IP (4 layers)' },
    ],
  },

  // ── W2 · IP Addressing & Subnetting ──────────────────────────────────────
  {
    week: 2,
    title: 'IP Addressing & Subnetting',
    description: 'How devices are numbered, how subnetting divides networks, and how IPv4 gives way to IPv6.',
    topics: [
      {
        title: 'IPv4 Addresses — The Basics',
        text: 'Every device on an IP network has an IP address — the network equivalent of a postal address. IPv4 is 32 bits, written as four decimal octets: 192.168.1.10. The address has two parts: the network part (which network) and the host part (which device on it).\n\nThe subnet mask marks the boundary: 255.255.255.0 (or /24) means the first three octets are the network, the last is the host. 192.168.1.0/24 is the network address; 192.168.1.255 is its broadcast.\n\nPrivate ranges (RFC 1918) are reserved for internal use and are not routable on the public internet: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.',
        code: 'IP:    192.168.1.10\nMask:  255.255.255.0   (/24)\n\nNetwork: 192.168.1.0   (host bits all 0)\nHost:    192.168.1.10\nBroadcast: 192.168.1.255 (host bits all 1)\n\n// Private ranges (RFC 1918)\n10.0.0.0/8       10.x.x.x\n172.16.0.0/12    172.16–31.x.x\n192.168.0.0/16   192.168.x.x',
        note: 'Subnet mask = where network ends and host begins. /24 is the range you will see most often.',
      },
      {
        title: 'Subnetting — Dividing a Network',
        text: 'Subnetting borrows host bits to create smaller networks. A /24 (255.255.255.0) can be split into two /25s, four /26s, or eight /27s — each with fewer hosts.\n\nEach new subnet needs its own network address, broadcast, and usable host range. The formula: usable hosts = 2^(host bits) − 2 (network + broadcast are reserved).\n\nWhy subnet? To organize (finance vs engineering), to contain traffic, and to control broadcast domains. A /24 gives 254 usable hosts; a /25 gives 126; a /26 gives 62.',
        code: '// Splitting a /24 into four /26 subnets\n192.168.1.0/26   hosts 192.168.1.1 – .62\n192.168.1.64/26  hosts 192.168.1.65 – .126\n192.168.1.128/26 hosts 192.168.1.129 – .190\n192.168.1.192/26 hosts 192.168.1.193 – .254\n\n// Usable hosts = 2^(32 - prefix) - 2\n/24 → 254   /25 → 126   /26 → 62   /30 → 2',
        note: 'Subnetting is just "how many host bits remain after the mask". Practise with a subnet calculator until it clicks.',
      },
      {
        title: 'IPv6 — The Next Generation',
        text: 'IPv4 offers about 4.3 billion addresses — not enough. IPv6 uses 128 bits, giving a practically inexhaustible supply. It is written as eight groups of hex: 2001:0db8:85a3:0000:0000:8a2e:0370:7334.\n\nLeading zeros can be dropped, and :: replaces one run of zero groups: 2001:db8::8a2e:370:7334. IPv6 has no NAT by default — every device can have a public address.\n\nAlmost every modern OS and network runs dual-stack: IPv4 and IPv6 together. You will rarely configure IPv6 by hand — but you must recognize the format and know that ::1 is loopback and link-local addresses start with fe80::.',
        code: '// IPv6 shorthand\n2001:0db8:85a3:0000:0000:8a2e:0370:7334\n→ 2001:db8:85a3::8a2e:370:7334   (drop leading zeros, :: once)\n\n::1        → IPv6 loopback (like 127.0.0.1)\nfe80::/10  → link-local (per-link addresses)\n\n// Check yours\nip -6 addr   (Linux)   ·   ipconfig       (Windows)',
        note: 'Recognize ::1 and fe80::. The rest of IPv6 configuration is mostly automatic via SLAAC.',
      },
      {
        title: 'Addressing in Practice: Static vs DHCP',
        text: 'Addresses come from two places: static configuration (you type the IP, mask, gateway, DNS) or DHCP (a server hands out addresses automatically). DHCP is the default for end devices; static is used for servers, routers and printers that must keep a known address.\n\nEvery device needs four things: its IP, its subnet mask, its default gateway (the router to reach other networks), and a DNS server (to turn names into addresses).\n\n"Can\'t connect?" often means one of these four is wrong. Check them in order: IP correct, mask correct, gateway reachable (ping it), DNS resolving (ping a name).',
        code: '// The four config items on every device\nIP:      192.168.1.50     your address\nMask:    255.255.255.0    your network size\nGateway: 192.168.1.1      door to other networks\nDNS:     8.8.8.8          name → address translator\n\n// DHCP vs Static\nDHCP    → automatic, leases expire, good for end devices\nStatic  → manual, never changes, good for servers/printers',
        note: 'IP, mask, gateway, DNS. When networking breaks, verify these four in exactly this order.',
      },
    ],
    quizzes: [
      { text: 'An IPv4 address is…', options: ['32 bits written as four octets', '128 bits of hex', 'a name like example.com', 'a MAC address'], correctAnswer: '32 bits written as four octets' },
      { text: 'The subnet mask /24 means…', options: ['the first 24 bits are the network', '24 usable hosts', '24 networks', 'nothing'], correctAnswer: 'the first 24 bits are the network' },
      { text: 'A /24 network has…', options: ['254 usable hosts', '24 hosts', '1024 hosts', '1 host'], correctAnswer: '254 usable hosts' },
      { text: 'IPv6 is…', options: ['128 bits written in hex groups', 'the same as IPv4', 'a subnet mask', 'a DNS record'], correctAnswer: '128 bits written in hex groups' },
    ],
  },

  // ── W3 · DNS, DHCP & How Devices Connect ─────────────────────────────────
  {
    week: 3,
    title: 'DNS, DHCP & How Devices Connect',
    description: 'The services that turn names into addresses, hand out IPs, and move frames on the wire.',
    topics: [
      {
        title: 'DNS — The Phonebook of the Internet',
        text: 'DNS (Domain Name System) translates human names — example.com — into IP addresses. It is a distributed database, not one giant server.\n\nHow a lookup works: your device asks a recursive resolver; the resolver walks the hierarchy — root servers → .com servers → the authoritative server for the domain — and returns the IP. Results are cached for speed.\n\nRecord types: A/AAAA map a name to an IPv4/IPv6 address; MX points to the mail server; CNAME aliases one name to another; TXT holds verification and policy data. nslookup and dig are the tools to see it all.',
        code: '// A DNS lookup\nBrowser "example.com"\n  → recursive resolver\n    → root servers\n    → .com servers\n    → authoritative: example.com → 93.184.216.34\n  ← cached, returned to the browser\n\n// Tools\nnslookup example.com\n→ Server: 1.1.1.1  Address: example.com = 93.184.216.34\n\ndig example.com A +short\n→ 93.184.216.34',
        note: '"It resolves" means DNS answered with an IP. When a site won\'t load, first check: does it resolve?',
      },
      {
        title: 'DHCP — Automatic Address Assignment',
        text: 'DHCP (Dynamic Host Configuration Protocol) hands out IP configuration automatically. When a device joins a network it broadcasts a discovery; a DHCP server offers a lease (IP, mask, gateway, DNS); the device requests it and the server acknowledges.\n\nLeases have a duration and are renewed before expiry. Why it matters: without DHCP you\'d configure every device by hand, and addresses would collide.\n\nTroubleshooting angle: "I have no internet" often means "no DHCP response". Renew the lease: Linux sudo dhclient -r && sudo dhclient, Windows ipconfig /release && ipconfig /renew. Check the address you get — 169.254.x.x (APIPA) means DHCP failed.',
        code: '// DHCP exchange (DORA)\nDiscover  "anyone out there?\nOffer     "here is 192.168.1.50, gateway .1, DNS 8.8.8.8"\nRequest   "I want that lease"\nAcknowledge "lease granted for 24h"\n\n// Renew\nLinux:   sudo dhclient -r && sudo dhclient\nWindows: ipconfig /release && ipconfig /renew\n\n// Bad sign: 169.254.x.x (APIPA) = no DHCP reply',
        note: 'A 169.254.x.x address is the network saying "I got nothing". Renew the lease, then check the server/switch.',
      },
      {
        title: 'MAC Addresses & ARP',
        text: 'The MAC address is the physical address burned into every NIC — 48 bits, written like 3C:22:FB:44:11:7A. IP addresses change as devices move between networks; MAC addresses identify the hardware itself.\n\nARP (Address Resolution Protocol) bridges the two: given an IP on the local network, ARP finds the matching MAC. The result is cached in an ARP table.\n\nSo: IP for end-to-end routing (like the postal address), MAC for last-hop delivery (like the door number). Both are needed for any communication.',
        code: '// The two addresses working together\nIP  = where on the internet (postal address)\nMAC = where on this wire (door number)\n\n// See the ARP table\nip neigh        (Linux)\narp -a          (Windows)\n\n3C:22:FB:44:11:7A  192.168.1.1  REACHABLE\nA4:5B:6C:77:88:99  192.168.1.20  STALE',
        note: 'You can change an IP; you cannot easily change a MAC. They solve different problems.',
      },
      {
        title: 'Switching, Ethernet & Wi-Fi',
        text: 'Ethernet is the wired standard: frames travel on copper or fibre, and a switch learns which MAC is on which port so it forwards each frame only where it needs to go. This is why a switch beats a hub — the hub broadcasts to everyone, the switch is selective.\n\nWi-Fi (802.11) replaces the wire with radio. A channel is a frequency band (1, 6, 11 are the non-overlapping 2.4 GHz ones). Security comes from WPA2/WPA3 — never an open or WEP network.\n\nWi-Fi drops for three big reasons: distance/signal, interference, and bad security settings. A wired connection is always faster and more reliable — remember that when debugging.',
        code: '// Wi-Fi security standards\nWEP   → broken, never use\nWPA   → old, weak\nWPA2  → current baseline\nWPA3  → newest, recommended\n\n// 2.4 GHz vs 5 GHz\n2.4 GHz → longer range, more interference\n5 GHz   → faster, shorter range\n\n// Diagnostic essentials\nping 192.168.1.1     # gateway reachable?\nip a                 # your own address?',
        note: 'The switch forwards selectively; Wi-Fi shares airtime. Both are the "link layer" under everything.',
      },
    ],
    quizzes: [
      { text: 'DNS translates…', options: ['names into IP addresses', 'IPs into MACs', 'ports into services', 'bytes into frames'], correctAnswer: 'names into IP addresses' },
      { text: 'The record that maps a domain to an IPv4 address is…', options: ['A', 'AAAA', 'MX', 'CNAME'], correctAnswer: 'A' },
      { text: 'A 169.254.x.x address indicates…', options: ['DHCP failed — no address was assigned', 'you have an invalid MAC', 'DNS is down', 'the gateway is wrong'], correctAnswer: 'DHCP failed — no address was assigned' },
      { text: 'The protocol that maps an IP to a MAC on the local network is…', options: ['ARP', 'DNS', 'DHCP', 'HTTP'], correctAnswer: 'ARP' },
    ],
  },

  // ── W4 · Routing, Firewalls & Security ───────────────────────────────────
  {
    week: 4,
    title: 'Routing, Firewalls & Security',
    description: 'How packets find their way across networks, and how firewalls and encryption keep them safe.',
    topics: [
      {
        title: 'Routing — Finding the Path',
        text: 'Routing is the process of moving packets between networks. Each router reads the destination IP, consults its routing table, and forwards the packet to the next hop toward its destination. This is hop-by-hop delivery — no router knows the whole path.\n\nRouting tables contain: destination networks, and the next hop (or the local interface) to reach them. A default route (0.0.0.0/0) catches everything that has no specific entry — usually pointing at the ISP.\n\nDynamic routing protocols (OSPF, BGP) let routers learn routes automatically. BGP is what runs the internet — thousands of autonomous systems announcing and exchanging routes.',
        code: '// Hop-by-hop delivery\nA ── R1 ── R2 ── R3 ── B\n\nR1: "B is not mine. Next hop toward B is R2."\nR2: "B is not mine. Next hop toward B is R3."\nR3: "B is directly connected. Deliver."\n\n// View routes (Linux)\nip route\n→ default via 192.168.1.1 dev wlan0\n→ 192.168.1.0/24 dev wlan0',
        note: 'Every router only knows the next hop, not the whole journey. That is what makes the internet scale.',
      },
      {
        title: 'NAT & Gateways',
        text: 'NAT (Network Address Translation) lets many private devices share one public IP. Your router rewrites the source address of outgoing packets and tracks each connection in a NAT table, so replies come back to the right device.\n\nThe home scenario: 10 devices, one public IP. NAT makes them all look like one address to the internet.\n\nPort forwarding is the exception: to reach a service inside your network from outside, you map a public port to a private IP — e.g., public 8080 → 192.168.1.50:80. That is how self-hosted services expose themselves. Never expose more than necessary.',
        code: '// NAT: many private → one public\nDevice 192.168.1.10 ──▶ router\n  router rewrites source to 203.0.113.5:52311\n  and remembers the mapping\n\n// Port forwarding (destination NAT)\nInternet:203.0.113.5:8080\n  → 192.168.1.50:80   (web server inside the LAN)\n\n// Check your NAT table\nLinux:  conntrack -L | head\nHome:   router admin page → "Port Forwarding"',
        note: 'NAT was invented to stretch IPv4 addresses. IPv6 removes the need, but NAT still dominates today.',
      },
      {
        title: 'Firewalls & Security Basics',
        text: 'A firewall filters traffic by rules — allowed or denied by IP, port, and protocol. Stateful firewalls track connections: they allow reply traffic automatically but block new, unsolicited connections unless a rule permits them.\n\nThe basic posture: deny by default, allow what is needed. On Linux, nftables/iptables (or frontends like ufw) implement this; on Windows, Windows Defender Firewall; on a home router, the firewall tab.\n\nNetwork security checklist: change default passwords, disable unneeded services, keep firmware updated, use WPA3 Wi-Fi, and never expose management interfaces to the internet.',
        code: '// ufw (Ubuntu frontend for nftables/iptables)\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow ssh\nsudo ufw allow http\nsudo ufw enable\n\nsudo ufw status verbose\n→ Status: active\n→ 22/tcp ALLOW IN\n→ 80/tcp ALLOW IN',
        note: 'Deny by default, allow exactly what you need. That one sentence is most of firewall best practice.',
      },
      {
        title: 'VPNs, TLS & Encrypted Communication',
        text: 'Encryption protects data in transit. TLS secures connections at the application layer — that is the padlock in the browser bar (HTTPS). VPNs create an encrypted tunnel between your device and a remote network, so all traffic looks like it comes from the VPN server.\n\nWhen to use what: HTTPS for websites (every time — never submit data over HTTP); VPN for accessing a private network remotely or for privacy on untrusted Wi-Fi. Split-tunnel VPNs route only some traffic through the tunnel.\n\nThe rule: any data you care about should be encrypted in transit. If a site offers no HTTPS, treat it as untrusted.',
        code: '// TLS in action (what HTTPS means)\nBrowser ── TLS handshake ──▶ Server\n  ✓ identity verified (certificate)\n  ✓ session key exchanged\n  ✓ all data now encrypted\n\n// VPN layers\nFull tunnel   → ALL traffic through the VPN\nSplit tunnel  → only specific traffic through the VPN\n\n// Check a certificate\nopenssl s_client -connect example.com:443 -servername example.com | head',
        note: 'HTTPS = TLS applied to HTTP. VPN = an encrypted tunnel. Both exist to keep data private in transit.',
      },
    ],
    quizzes: [
      { text: 'Routing moves packets…', options: ['hop by hop toward the destination', 'in one direct jump', 'only within a LAN', 'randomly'], correctAnswer: 'hop by hop toward the destination' },
      { text: 'The protocol that runs the internet\'s routing is…', options: ['BGP', 'HTTP', 'DHCP', 'ARP'], correctAnswer: 'BGP' },
      { text: 'NAT lets many private devices…', options: ['share one public IP', 'have separate public IPs', 'skip the router', 'hide their MACs'], correctAnswer: 'share one public IP' },
      { text: 'The correct firewall posture is…', options: ['deny by default, allow what is needed', 'allow everything', 'deny everything always', 'no firewall'], correctAnswer: 'deny by default, allow what is needed' },
    ],
  },

  // ── W5 · Diagnostics & Real-World Networks ───────────────────────────────
  {
    week: 5,
    title: 'Diagnostics & Real-World Networks',
    description: 'The tools and method for fixing real connectivity problems, and how it all fits the real world.',
    topics: [
      {
        title: 'ping & Traceroute — Is It Reachable?',
        text: 'ping sends ICMP echo requests and measures the reply — the first test of connectivity. ping 8.8.8.8 tests raw internet reachability; ping example.com also tests DNS; ping 192.168.1.1 tests your local gateway.\n\ntraceroute (tracert on Windows) shows each hop a packet takes — it maps the path and reveals where delays or losses start.\n\nRead the pattern: if you can ping the gateway but not an internet IP, the problem is between you and the ISP. If you can ping an IP but not a name, DNS is the problem.',
        code: '$ ping 8.8.8.8\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=114 time=12.3 ms\n64 bytes from 8.8.8.8: icmp_seq=2 ttl=114 time=11.9 ms\n\n$ traceroute 8.8.8.8\n 1  192.168.1.1      2.1 ms\n 2  10.0.0.1         8.4 ms\n 3  * * *            (hop hides or drops ICMP)\n 4  8.8.8.8         12.0 ms\n\n// Decision tree\nping 127.0.0.1     fail → stack broken\nping gateway       fail → LAN / cabling\nping 8.8.8.8       fail → ISP\nping example.com   fail → DNS',
        note: 'ping is the "is anything alive?" test. Work outwards: yourself, gateway, internet, then name resolution.',
      },
      {
        title: 'ip, ipconfig, netstat & the Diagnostic Toolkit',
        text: 'ip (Linux) and ipconfig (Windows) show your own configuration: addresses, masks, gateway, DNS. netstat (or ss on Linux) lists open connections and listening ports. They answer "what is this device actually configured to do?" and "what is talking to what?"\n\nOther tools: nmap scans what a host is listening on; dig/nslookup interrogate DNS; arp/ip neigh shows neighbours on your network.\n\nCombine them: when something won\'t connect, check your config (ip addr), confirm listening ports (ss -tulpn), test reachability (ping), then follow the path (traceroute).',
        code: '$ ip addr            # your addresses\n$ ip route           # your gateway\n$ ss -tulpn          # what is listening\nProto Local Address      State   PID/Program\ntcp    0.0.0.0:22        LISTEN  812/sshd\ntcp    0.0.0.0:80        LISTEN  900/nginx\n\n# Windows equivalents\nipconfig /all\nnetstat -ano\n\n# See neighbours / scan\nip neigh           ·   nmap -sn 192.168.1.0/24',
        note: 'ss -tulpn is the answer to "is the service even listening?" — the first question in most server debugging.',
      },
      {
        title: 'Diagnosing Common Network Faults',
        text: 'The methodical loop beats random clicking: reproduce → check config → test the link → follow the path → check DNS → isolate the layer. Work from the device outward.\n\nCommon faults and their signatures: no DHCP reply (169.254.x.x); gateway unreachable (switch/router down or cabling); DNS failure (name won\'t resolve but IP pings); port blocked (host pings but the service won\'t connect — think firewall); Wi-Fi slow (signal, interference, or channel congestion).\n\nWrite down what you observe, change one variable at a time, and test after each change. Networking bugs are almost always a broken link in a chain — find the link.',
        code: '// The method\n1. Reproduce the exact failure\n2. ip addr / ipconfig — is my config sane?\n3. ping gateway — is the LAN up?\n4. ping 8.8.8.8 — is the internet up?\n5. nslookup example.com — does DNS work?\n6. test the service port — is it blocked?\n\n// Port test (is the service reachable?)\n$ nc -zv example.com 443\nConnection to example.com port 443 succeeded!',
        note: 'One variable at a time. Write the observations. The chain is only as strong as its weakest hop.',
      },
      {
        title: 'Home & Office Networks in the Real World',
        text: 'A home network: modem (from ISP) → router (NAT, DHCP, firewall) → switch/AP → devices. An office adds structured cabling, a managed core switch, VLANs to separate traffic (voice, guests, servers), and often multiple WAN links for resilience.\n\nDesign principles that matter: separate guest Wi-Fi from your main network; give static IPs (or DHCP reservations) to printers and servers; keep firmware and security patches current; document the topology — a one-page diagram and an IP list are worth more than a month of head-scratching.\n\nYour edge devices (router, APs, switch) are the gatekeepers. Replace old ones, update them, and set strong admin passwords. Most home networks fall because of default credentials, not exotic attacks.',
        code: '// Home network map\nInternet ── ISP modem ── home router ──┬── switch ── wired devices\n                                        └── Wi-Fi AP ── phones/laptops\n\n// Good practice in one page\n1. Guest Wi-Fi isolated from the main LAN\n2. DHCP reservations for servers/printers\n3. Strong admin password on every device\n4. Firmware auto-update ON\n5. One-page diagram + IP list documented',
        note: 'Segment traffic, patch your edge devices, document the topology. That covers 90% of home/office hardening.',
      },
    ],
    quizzes: [
      { text: 'The first connectivity test is usually…', options: ['ping', 'traceroute', 'nmap', 'dig'], correctAnswer: 'ping' },
      { text: 'If you can ping 8.8.8.8 but not example.com, the problem is…', options: ['DNS', 'the internet', 'your cabling', 'the power'], correctAnswer: 'DNS' },
      { text: 'The command that shows what is listening on your machine is…', options: ['ss -tulpn (or netstat)', 'ping', 'ipconfig', 'ls'], correctAnswer: 'ss -tulpn (or netstat)' },
      { text: 'The methodical debugging loop…', options: ['changes one variable at a time and tests after each', 'changes everything at once', 'reboots randomly', 'never checks config'], correctAnswer: 'changes one variable at a time and tests after each' },
    ],
  },
];
