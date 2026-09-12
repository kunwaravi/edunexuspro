/**
 * Networking Fundamentals — per-topic quizzes. Keyed by the EXACT topic titles
 * in networking.ts (topic-lock flow). 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in networking.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'What Is a Network?': [
    { text: 'The internet is…', options: ['a network of networks cooperating through open standards', 'one giant server', 'a single cable', 'a company'], correctAnswer: 'a network of networks cooperating through open standards' },
    { text: 'The agreed rules for how messages are exchanged are called…', options: ['protocols', 'cables', 'ports', 'packets'], correctAnswer: 'protocols' },
    { text: 'A LAN is…', options: ['a local network within one building', 'a city-wide network', 'the internet', 'a Wi-Fi channel'], correctAnswer: 'a local network within one building' },
    { text: 'HTTP, TCP, IP and DNS are all examples of…', options: ['protocols', 'hardware', 'cables', 'ISP services'], correctAnswer: 'protocols' },
  ],
  'Network Hardware: NICs, Switches, Routers': [
    { text: 'A switch works…', options: ['inside one network, forwarding to the right device', 'between different networks', 'only for Wi-Fi', 'only for the internet'], correctAnswer: 'inside one network, forwarding to the right device' },
    { text: 'A router connects…', options: ['different networks together', 'two NICs on one PC', 'monitors', 'printers'], correctAnswer: 'different networks together' },
    { text: 'The device that adds Wi-Fi to a wired network is…', options: ['an access point', 'a switch', 'a router only', 'a modem'], correctAnswer: 'an access point' },
    { text: 'The home router usually combines…', options: ['router, switch, AP, DHCP server and firewall', 'only routing', 'a CPU and RAM', 'a modem'], correctAnswer: 'router, switch, AP, DHCP server and firewall' },
  ],
  'Clients, Servers & Peer-to-Peer': [
    { text: 'In client-server, the server…', options: ['offers a service clients request', 'does all the browsing', 'has no address', 'is the browser'], correctAnswer: 'offers a service clients request' },
    { text: 'Servers need fixed addresses so that…', options: ['clients can always find them', 'they are faster', 'they use less power', 'they are safe'], correctAnswer: 'clients can always find them' },
    { text: 'In peer-to-peer networking…', options: ['every node is both client and server', 'one node rules', 'no one sends data', 'only servers exist'], correctAnswer: 'every node is both client and server' },
    { text: 'An example of P2P is…', options: ['BitTorrent', 'a website', 'email', 'an online store'], correctAnswer: 'BitTorrent' },
  ],
  'The OSI Model & TCP/IP — Layers of Abstraction': [
    { text: 'The TCP/IP model has…', options: ['4 layers', '7 layers', '2 layers', '1 layer'], correctAnswer: '4 layers' },
    { text: 'HTTP and DNS belong to the…', options: ['application layer', 'transport layer', 'internet layer', 'link layer'], correctAnswer: 'application layer' },
    { text: 'TCP and UDP operate at the…', options: ['transport layer', 'link layer', 'physical layer', 'application layer'], correctAnswer: 'transport layer' },
    { text: 'Layers exist so that…', options: ['each layer can change independently without breaking the others', 'everything is one blob', 'there are more acronyms', 'routers work harder'], correctAnswer: 'each layer can change independently without breaking the others' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'IPv4 Addresses — The Basics': [
    { text: 'IPv4 is…', options: ['32 bits in four decimal octets', '128 bits in hex', '64 bits', 'a name'], correctAnswer: '32 bits in four decimal octets' },
    { text: 'The subnet mask separates…', options: ['the network part from the host part', 'the IP from the MAC', 'data from voice', 'LAN from WAN'], correctAnswer: 'the network part from the host part' },
    { text: 'In 192.168.1.0/24, the broadcast address is…', options: ['192.168.1.255', '192.168.1.0', '192.168.1.1', '192.168.0.255'], correctAnswer: '192.168.1.255' },
    { text: 'Private ranges include…', options: ['192.168.0.0/16', '8.8.8.0/8', '172.0.0.0/8', '203.0.113.0/24'], correctAnswer: '192.168.0.0/16' },
  ],
  'Subnetting — Dividing a Network': [
    { text: 'Subnetting splits a network by…', options: ['borrowing host bits to create smaller networks', 'adding more routers', 'changing MACs', 'using longer cables'], correctAnswer: 'borrowing host bits to create smaller networks' },
    { text: 'A /25 network has…', options: ['126 usable hosts', '254 hosts', '62 hosts', '1 host'], correctAnswer: '126 usable hosts' },
    { text: 'The two reserved addresses per subnet are…', options: ['network and broadcast', 'gateway and DNS', 'first and second', 'MAC and IP'], correctAnswer: 'network and broadcast' },
    { text: 'The formula for usable hosts is…', options: ['2^(32 - prefix) - 2', '2^prefix', 'prefix - 2', '256 - prefix'], correctAnswer: '2^(32 - prefix) - 2' },
  ],
  'IPv6 — The Next Generation': [
    { text: 'IPv6 uses…', options: ['128 bits in hex groups', '32 bits in octets', '64 bits', 'decimal dots'], correctAnswer: '128 bits in hex groups' },
    { text: 'The shorthand :: replaces…', options: ['one run of zero groups', 'all letters', 'the port', 'nothing'], correctAnswer: 'one run of zero groups' },
    { text: 'The IPv6 loopback address is…', options: ['::1', '127.0.0.1', 'fe80::', '2001:db8::'], correctAnswer: '::1' },
    { text: 'Link-local IPv6 addresses begin with…', options: ['fe80::', '2001:db8::', '::1', '10.0.0.'], correctAnswer: 'fe80::' },
  ],
  'Addressing in Practice: Static vs DHCP': [
    { text: 'DHCP…', options: ['hands out IP configuration automatically', 'assigns MAC addresses', 'blocks traffic', 'encrypts data'], correctAnswer: 'hands out IP configuration automatically' },
    { text: 'The four config items on every device are…', options: ['IP, mask, gateway, DNS', 'IP, MAC, port, name', 'user, pass, key, cert', 'SSID, channel, band, key'], correctAnswer: 'IP, mask, gateway, DNS' },
    { text: 'A static address is right for…', options: ['servers and printers', 'every phone', 'laptops', 'nothing'], correctAnswer: 'servers and printers' },
    { text: 'When networking breaks, check the four items…', options: ['in order: IP, mask, gateway, DNS', 'at random', 'only the DNS', 'all at once blindly'], correctAnswer: 'in order: IP, mask, gateway, DNS' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'DNS — The Phonebook of the Internet': [
    { text: 'DNS is…', options: ['a distributed database', 'one giant server', 'a cable', 'a firewall'], correctAnswer: 'a distributed database' },
    { text: 'The record that maps a name to an IPv4 address is…', options: ['A', 'AAAA', 'MX', 'TXT'], correctAnswer: 'A' },
    { text: 'The record that points to the mail server is…', options: ['MX', 'A', 'CNAME', 'NS'], correctAnswer: 'MX' },
    { text: 'The tools for DNS lookups include…', options: ['nslookup and dig', 'ping and traceroute', 'netstat and ip', 'ss and nmap'], correctAnswer: 'nslookup and dig' },
  ],
  'DHCP — Automatic Address Assignment': [
    { text: 'The DHCP exchange is…', options: ['Discover, Offer, Request, Acknowledge', 'Request, Reply, Done', 'Hello, World, Bye', 'Connect, Send, Close'], correctAnswer: 'Discover, Offer, Request, Acknowledge' },
    { text: 'The address a device gets when DHCP fails is…', options: ['169.254.x.x', '192.168.1.1', '0.0.0.0', '8.8.8.8'], correctAnswer: '169.254.x.x' },
    { text: 'Leases…', options: ['have a duration and are renewed before expiry', 'never expire', 'are permanent', 'are per MAC only'], correctAnswer: 'have a duration and are renewed before expiry' },
    { text: '"I have no internet" often means…', options: ['no DHCP response', 'the MAC is bad', 'the switch is a hub', 'Wi-Fi is 5 GHz'], correctAnswer: 'no DHCP response' },
  ],
  'MAC Addresses & ARP': [
    { text: 'A MAC address is…', options: ['the physical address burned into a NIC', 'the IP address', 'a DNS record', 'a subnet'], correctAnswer: 'the physical address burned into a NIC' },
    { text: 'ARP maps…', options: ['an IP to a MAC on the local network', 'a name to an IP', 'a port to a service', 'a route to a gateway'], correctAnswer: 'an IP to a MAC on the local network' },
    { text: 'The ARP results are…', options: ['cached in an ARP table', 'discarded each time', 'sent to the internet', 'stored in DNS'], correctAnswer: 'cached in an ARP table' },
    { text: 'The right mental model is…', options: ['IP = postal address, MAC = door number', 'IP = door, MAC = post office', 'they are the same', 'MAC = web name'], correctAnswer: 'IP = postal address, MAC = door number' },
  ],
  'Switching, Ethernet & Wi-Fi': [
    { text: 'A switch is better than a hub because…', options: ['it forwards frames selectively instead of broadcasting to everyone', 'it is cheaper', 'it is faster to install', 'it blocks Wi-Fi'], correctAnswer: 'it forwards frames selectively instead of broadcasting to everyone' },
    { text: 'The non-overlapping 2.4 GHz channels are…', options: ['1, 6, 11', '1, 2, 3', '10, 20, 30', 'all channels'], correctAnswer: '1, 6, 11' },
    { text: 'The current minimum Wi-Fi security is…', options: ['WPA2 (WPA3 better)', 'WEP', 'WPA', 'none'], correctAnswer: 'WPA2 (WPA3 better)' },
    { text: 'Wi-Fi drops mostly because of…', options: ['signal, interference, or bad security settings', 'the ethernet cable', 'too many MACs', 'the router firmware'], correctAnswer: 'signal, interference, or bad security settings' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Routing — Finding the Path': [
    { text: 'Routing delivers packets…', options: ['hop by hop', 'in one jump', 'only locally', 'randomly'], correctAnswer: 'hop by hop' },
    { text: 'Each router decides the next hop by…', options: ['consulting its routing table', 'asking the destination', 'flipping a coin', 'broadcasting to all'], correctAnswer: 'consulting its routing table' },
    { text: 'The default route catches…', options: ['everything without a specific entry', 'only local traffic', 'DNS queries', 'nothing'], correctAnswer: 'everything without a specific entry' },
    { text: 'The protocol that runs the internet\'s routing is…', options: ['BGP', 'OSPF alone', 'DHCP', 'ARP'], correctAnswer: 'BGP' },
  ],
  'NAT & Gateways': [
    { text: 'NAT lets…', options: ['many private devices share one public IP', 'every device get a public IP', 'routers disappear', 'MACs change'], correctAnswer: 'many private devices share one public IP' },
    { text: 'The router tracks each connection in…', options: ['a NAT table', 'a DNS cache', 'an ARP table', 'a routing table'], correctAnswer: 'a NAT table' },
    { text: 'Port forwarding maps…', options: ['a public port to a private IP and port', 'a MAC to a port', 'a name to an IP', 'nothing'], correctAnswer: 'a public port to a private IP and port' },
    { text: 'NAT exists mainly because…', options: ['IPv4 addresses are scarce', 'it is faster', 'it is secure by design', 'routers need it'], correctAnswer: 'IPv4 addresses are scarce' },
  ],
  'Firewalls & Security Basics': [
    { text: 'A firewall filters traffic by…', options: ['rules based on IP, port and protocol', 'the MAC only', 'the file content', 'the cable colour'], correctAnswer: 'rules based on IP, port and protocol' },
    { text: 'A stateful firewall…', options: ['tracks connections and allows reply traffic', 'blocks everything', 'only filters by name', 'is the same as a hub'], correctAnswer: 'tracks connections and allows reply traffic' },
    { text: 'The correct baseline posture is…', options: ['deny by default, allow what is needed', 'allow all incoming', 'deny all traffic', 'no rules'], correctAnswer: 'deny by default, allow what is needed' },
    { text: 'ufw is…', options: ['a Linux firewall frontend', 'a Wi-Fi password', 'a router brand', 'a DNS tool'], correctAnswer: 'a Linux firewall frontend' },
  ],
  'VPNs, TLS & Encrypted Communication': [
    { text: 'The padlock in the browser means…', options: ['TLS is protecting the connection', 'the site is free', 'the site is fast', 'Wi-Fi is encrypted'], correctAnswer: 'TLS is protecting the connection' },
    { text: 'A VPN creates…', options: ['an encrypted tunnel to a remote network', 'a faster Wi-Fi', 'a new IP range', 'a stronger password'], correctAnswer: 'an encrypted tunnel to a remote network' },
    { text: 'Split-tunnel VPN routes…', options: ['only specific traffic through the tunnel', 'all traffic through the tunnel', 'nothing through', 'Wi-Fi only'], correctAnswer: 'only specific traffic through the tunnel' },
    { text: 'The rule for data you care about is…', options: ['encrypt it in transit — HTTPS always', 'send it over HTTP', 'skip certificates', 'share the password'], correctAnswer: 'encrypt it in transit — HTTPS always' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'ping & Traceroute — Is It Reachable?': [
    { text: 'ping sends…', options: ['ICMP echo requests and measures replies', 'HTTP requests', 'DNS queries', 'MAC frames'], correctAnswer: 'ICMP echo requests and measures replies' },
    { text: 'If you can ping an IP but not a name, the problem is…', options: ['DNS', 'the ISP', 'your NIC', 'the gateway'], correctAnswer: 'DNS' },
    { text: 'traceroute shows…', options: ['each hop a packet takes', 'your IP address', 'open ports', 'the Wi-Fi signal'], correctAnswer: 'each hop a packet takes' },
    { text: 'The working-outwards order is…', options: ['self, gateway, internet IP, then a name', 'gateway, self, name, internet', 'name first', 'random'], correctAnswer: 'self, gateway, internet IP, then a name' },
  ],
  'ip, ipconfig, netstat & the Diagnostic Toolkit': [
    { text: 'The command that shows your own addresses is…', options: ['ip addr (or ipconfig)', 'ping', 'nmap', 'dig'], correctAnswer: 'ip addr (or ipconfig)' },
    { text: 'The command that lists listening ports is…', options: ['ss -tulpn (or netstat)', 'ip route', 'nslookup', 'traceroute'], correctAnswer: 'ss -tulpn (or netstat)' },
    { text: 'The first question in server debugging is…', options: ['is the service even listening?', 'is the power on?', 'is the CSS loaded?', 'is the DNS cached?'], correctAnswer: 'is the service even listening?' },
    { text: 'To discover what a host is listening on you can use…', options: ['nmap', 'ping', 'ss only for local', 'traceroute'], correctAnswer: 'nmap' },
  ],
  'Diagnosing Common Network Faults': [
    { text: 'The methodical debugging loop is…', options: ['reproduce → check config → test the link → follow the path → check DNS', 'reboot until fixed', 'change everything at once', 'reinstall the OS'], correctAnswer: 'reproduce → check config → test the link → follow the path → check DNS' },
    { text: 'The signature of "no DHCP reply" is…', options: ['a 169.254.x.x address', 'a 192.168 address', 'no Wi-Fi icon', 'slow speeds'], correctAnswer: 'a 169.254.x.x address' },
    { text: 'A host that pings but whose service won\'t connect suggests…', options: ['a firewall blocking the port', 'DNS failure', 'a bad cable', 'a wrong MAC'], correctAnswer: 'a firewall blocking the port' },
    { text: 'The correct practice is…', options: ['change one variable at a time and test after each', 'change many things and hope', 'never test', 'skip config checks'], correctAnswer: 'change one variable at a time and test after each' },
  ],
  'Home & Office Networks in the Real World': [
    { text: 'A typical home network is…', options: ['ISP modem → router → switch/AP → devices', 'one giant router for all cities', 'direct cables to the ISP', 'no router'], correctAnswer: 'ISP modem → router → switch/AP → devices' },
    { text: 'VLANs are used in offices to…', options: ['separate traffic like voice, guests and servers', 'speed up Wi-Fi', 'replace cables', 'hide MACs'], correctAnswer: 'separate traffic like voice, guests and servers' },
    { text: 'The top home-network failure is…', options: ['default credentials on edge devices', 'too many cables', 'DNS misconfig', 'no static IP'], correctAnswer: 'default credentials on edge devices' },
    { text: 'A one-page diagram and an IP list are worth…', options: ['more than a month of head-scratching', 'nothing', 'only for enterprise', 'a backup'], correctAnswer: 'more than a month of head-scratching' },
  ],
};
