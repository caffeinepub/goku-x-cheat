import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Complaint, Product } from "../backend.d";
import { useActor } from "./useActor";

export function useActiveProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["activeProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVisitCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["visitCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.incrementVisitCounter();
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, product }: { id: bigint; product: Product }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProduct(id, product);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allProducts"] });
      qc.invalidateQueries({ queryKey: ["activeProducts"] });
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("No actor");
      return actor.addProduct(product);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allProducts"] });
      qc.invalidateQueries({ queryKey: ["activeProducts"] });
    },
  });
}

export function useAllComplaints() {
  const { actor, isFetching } = useActor();
  return useQuery<Complaint[]>({
    queryKey: ["allComplaints"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllComplaints();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitComplaint() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      subject,
      message,
    }: {
      name: string;
      subject: string;
      message: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return (actor as any).submitComplaint(name, subject, message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allComplaints"] });
    },
  });
}

export function useReplyToComplaint() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      reply,
    }: {
      id: bigint;
      reply: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return (actor as any).replyToComplaint(id, reply);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allComplaints"] });
    },
  });
}
