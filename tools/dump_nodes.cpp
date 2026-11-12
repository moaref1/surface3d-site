// Writes every node the current Surface3D build knows as JSON for the website's node reference.
#include "core/graph.h"
#include "core/graph_library.h"
#include <cmath>
#include <cstdio>
#include <string>

using namespace sl;

static std::string esc(const char *s) {
    std::string o;
    for (const char *p = s ? s : ""; *p; ++p) {
        unsigned char c = (unsigned char)*p;
        if (c == '"' || c == '\\') { o += '\\'; o += (char)c; }
        else if (c == '\n') o += "\\n";
        else if (c < 0x20) o += ' ';
        else o += (char)c;
    }
    return o;
}
static const char *typeName(SocketType t) {
    switch (t) {
    case SocketType::Value: return "Value";
    case SocketType::Color: return "Color";
    case SocketType::Vector: return "Vector";
    case SocketType::Boolean: return "Boolean";
    case SocketType::Integer: return "Integer";
    case SocketType::Normal: return "Normal";
    case SocketType::Path: return "Path";
    }
    return "Value";
}
static void num(FILE *f, float v) {
    if (!std::isfinite(v)) { std::fputs("null", f); return; }
    std::fprintf(f, "%.6g", v);
}

int main(int argc, char **argv) {
    FILE *f = argc > 1 ? std::fopen(argv[1], "wb") : stdout;
    if (!f) return 1;
    std::fputs("[\n", f);
    bool first = true;
    for (uint32_t k = 0; k < kNodeKindCount; ++k) {
        NodeKind kind = NodeKind(k);
        GraphNode n;
        try { n = makeNode(kind, 1); } catch (...) { continue; }
        const char *name = nodeName(kind);
        if (!name || !*name) continue;
        if (!first) std::fputs(",\n", f);
        first = false;
        std::fprintf(f, "{\"kind\":%u,\"name\":\"%s\",\"category\":\"%s\",\"description\":\"%s\",\"creatable\":%s,\"spatial\":%s,\"output\":%s",
                     k, esc(name).c_str(), esc(nodeCategory(kind)).c_str(), esc(nodeDescription(kind)).c_str(),
                     creationNode(kind) ? "true" : "false", spatialNode(kind) ? "true" : "false",
                     outputNode(kind) ? "true" : "false");
        std::fputs(",\"inputs\":[", f);
        for (int i = 0; i < inputCount(n); ++i) {
            std::fprintf(f, "%s{\"name\":\"%s\",\"type\":\"%s\"}", i ? "," : "", esc(inputName(n, i)).c_str(),
                         typeName(inputType(kind, i)));
        }
        std::fputs("],\"outputs\":[", f);
        std::vector<GraphNode> g{n};
        for (int i = 0; i < outputCount(n); ++i) {
            SocketType t = outputType(kind);
            try { t = resolvedOutputType(g, n, uint32_t(i)); } catch (...) {}
            std::fprintf(f, "%s{\"name\":\"%s\",\"type\":\"%s\"}", i ? "," : "", esc(outputName(n, i)).c_str(), typeName(t));
        }
        std::fputs("],\"parameters\":[", f);
        bool pf = true;
        uint32_t slots = nodeParameterSlots(n);
        for (uint32_t s = 0; s < slots && s < kMaxNodeControls; ++s) {
            ParameterSpec p = parameterSpec(n, s);
            if (!p.name || !*p.name) continue;
            std::fprintf(f, "%s{\"slot\":%u,\"name\":\"%s\",\"type\":\"%s\",\"components\":%u,\"min\":", pf ? "" : ",", s,
                         esc(p.name).c_str(), typeName(p.type), p.components);
            num(f, p.low);
            std::fputs(",\"max\":", f);
            num(f, p.high);
            std::fputs(",\"default\":", f);
            float d = 0;
            try { d = nodeParameterValue(n, s); } catch (...) {}
            num(f, d);
            std::fputs("}", f);
            pf = false;
            if (p.components > 1) s += p.components - 1;
        }
        std::fputs("]}", f);
    }
    std::fputs("\n]\n", f);
    if (f != stdout) std::fclose(f);
    return 0;
}
