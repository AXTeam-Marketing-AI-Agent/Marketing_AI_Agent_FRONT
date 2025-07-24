// utils/api.ts (또는 컴포넌트 내부)
export async function createFactbook(data: {
  creator_name: string;
  brand_name: string;
  industry: string;
  description?: string;
  rfpFile?: File | null;
}) {
  const formData = new FormData();
  formData.append("creator_name", data.creator_name);
  formData.append("brand_name", data.brand_name);
  formData.append("industry", data.industry);
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.rfpFile) {
    formData.append("files", data.rfpFile);
  }

  // 실제 FormData 값 확인
  for (const [key, value] of formData.entries()) {
    console.log("FormData:", key, value);
  }

  const res = await fetch("http://localhost:8000/factbooks/generate/", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("팩트북 생성 실패");
  return await res.json();
}

export async function createStrategy(data: {
  factbook_id: string;
  strategy_type: string;
  objective?: string;
  creator?: string;
  description?: string;
  files?: File[];
}) {
  const formData = new FormData();
  formData.append("factbook_id", data.factbook_id);
  formData.append("strategy_type", data.strategy_type);
  if (data.objective) {
    formData.append("objective", data.objective);
  }
  if (data.creator) {
    formData.append("creator", data.creator);
  }
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.files && data.files.length > 0) {
    data.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  // 실제 FormData 값 확인
  for (const [key, value] of formData.entries()) {
    console.log("Strategy FormData:", key, value);
  }

  const res = await fetch("http://localhost:8000/strategies/generate/", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("전략 생성 실패");
  return await res.json();
}