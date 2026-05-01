'use client';
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Resource, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import axios from "axios";
import { ResourceForm } from "./ResourceForm";

export function NewResourcePage() {
  const router = useRouter();
  const { resourceTypes, setResourcesLoaded } = useStore((s) => s);
  const { fetchResources } = useData();
  const [newType, setNewType] = useState('');
  const [resource, setResource] = useState<Partial<Resource> | null>(null);

  useEffect(() => {
    fetchResources();
    if (!resource) {
      setResource({
        title: "",
        author: "",
        type: resourceTypes[0] || "",
        description: "",
        imageURL: "",
        linkURL: "",
        readyToPublish: false,
      });
    }
  }, []);

  const routeBack = useCallback(() => {
    router.push('/admin');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/resources", resource);
      setResourcesLoaded(false);
      router.push('/admin');
    } catch (err) {
      console.error("Failed to create resource:", err);
    }
  };

  const changeNewType = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewType(e.target.value);
    setResource((prev) => ({ ...prev, type: e.target.value }));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResource((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="adminPanel">
      <div className="titleBar">
        <span className="adminBack" onClick={routeBack}>← Admin</span>
        {` :: New Resource`}
      </div>
      <div className="adminContent">
        {resource && (
          <ResourceForm
            resource={resource}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            editing={false}
            newType={newType}
            changeNewType={changeNewType}
          />
        )}
      </div>
    </div>
  );
}
