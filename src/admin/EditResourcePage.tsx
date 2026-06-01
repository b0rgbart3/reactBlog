'use client';
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Resource, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import axios from "axios";
import { ResourceForm } from "./ResourceForm";

export function EditResourcePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { resourcesById, setResourcesLoaded } = useStore((s) => s);
  const { fetchResources } = useData();
  const [resource, setResource] = useState<Resource | undefined>(resourcesById[id]);
  const [newType, setNewType] = useState('');

  useEffect(() => {
    if (!resource) {
      fetchResources().then(() => {
        setResource(useStore.getState().resourcesById[id]);
      });
    }
  }, []);

  const routeBack = useCallback(() => {
    router.push('/admin');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/resources/${id}`, resource);
      setResourcesLoaded(false);
      router.push('/admin');
    } catch (err) {
      console.error("Failed to update resource:", err);
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
        {` :: Edit Resource`}
      </div>
      <div className="adminContent">
        {resource && (
          <ResourceForm
            resource={resource}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            editing
            newType={newType}
            changeNewType={changeNewType}
          />
        )}
      </div>
    </div>
  );
}
