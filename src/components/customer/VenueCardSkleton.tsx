import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function VenueCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden flex flex-col justify-between">
      {/* Skeleton Gambar */}
      <CardHeader className="p-0 relative h-48 w-full">
        <Skeleton className="h-full w-full" />
      </CardHeader>

      {/* Skeleton Konten */}
      <CardContent className="p-4 space-y-3">
        {/* Judul dan Harga */}
        <div className="flex justify-between items-start gap-2">
          <Skeleton className="h-6 w-3/5" />
          <div className="text-right flex-shrink-0 w-1/3 space-y-1.5">
            <Skeleton className="h-3 w-full ml-auto" />
            <Skeleton className="h-5 w-full ml-auto" />
          </div>
        </div>
        
        {/* Alamat */}
        <Skeleton className="h-4 w-4/5" />

        {/* Deskripsi */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        
        {/* Fasilitas */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>

      {/* Skeleton Footer */}
      <CardFooter className="p-4 flex justify-between items-center border-t border-border/20 mt-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );
}