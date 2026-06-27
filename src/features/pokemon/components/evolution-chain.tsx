"use client";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { EvolutionNode } from "../types";
import { ChevronRight, ChevronDown } from "lucide-react";
interface EvolutionChainProps { chain: EvolutionNode; }
function EvolutionItem({ node, isRoot = false }: { node: EvolutionNode; isRoot?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-4 lg:flex-row lg:gap-8"
    >
      {!isRoot && ( <div className="flex items-center justify-center text-muted-foreground/30"><ChevronRight className="hidden h-8 w-8 lg:block" /><ChevronDown className="block h-8 w-8 lg:hidden" /></div> )}
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <Link href={`/pokemon/${node.name}`} className="group">
          <div className="relative aspect-square w-24 overflow-hidden rounded-full border border-border/50 bg-secondary/20 p-2 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5 md:w-32">
            <Image src={node.image} alt={node.name} fill className="object-contain transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 96px, 128px" />
          </div>
          <div className="mt-2 text-center text-sm font-bold capitalize tracking-tight transition-colors group-hover:text-primary">{node.name}</div>
        </Link>
        {node.children.length > 0 && ( <div className="flex flex-col gap-8 lg:flex-row lg:items-center"><div className="flex flex-col gap-8">{node.children.map((child) => ( <EvolutionItem key={child.id} node={child} /> ))}</div></div> )}
      </div>
    </motion.div>
  );
}
export function EvolutionChain({ chain }: EvolutionChainProps) {
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm md:p-8">
      <h2 className="mb-8 text-2xl font-black tracking-tight">Evolution Chain</h2>
      <div className="flex justify-center overflow-x-auto pb-4"><EvolutionItem node={chain} isRoot /></div>
    </Card>
  );
}
