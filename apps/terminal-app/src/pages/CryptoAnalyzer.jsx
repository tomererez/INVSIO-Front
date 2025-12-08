import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function CryptoAnalyzer() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate(createPageUrl("AIAnalysis"));
  }, [navigate]);
  
  return null;
}